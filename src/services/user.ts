import { DynamoClient } from '@helpers/databases/ddb';

import { Schema } from '@entities/user/table';
import { a0, requirements, user } from '@entities/user/interfaces';

import { auth0 as env } from '@helpers/config';
import * as lang_registration from '@i18n/registration';
import * as lang_user from '@i18n/user';
import { httpWrapper as Http } from '@services/http';

const lang = { ...lang_registration, ...lang_user };

function schema(_target: unknown, _key: string, descriptor: PropertyDescriptor) {
    const ctx = descriptor.value;

    descriptor.value = function(...args: unknown[]) {
        const str: string = JSON.stringify(args[1]);
        const u: user = JSON.parse(str);
        const obj = Object.assign(new Schema, { email: u.email, sub: u.sub });
        const result = ctx.apply(this, [args[0], obj]);
        return result;
    };

    return descriptor;
}

function whitelist(method: string[]) {
    return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
        const ctx = descriptor.value;

        descriptor.value = function(...args: unknown[]) {
            const result = method.includes(args[0].toString()) ? ctx.apply(this, args) : null;
            return result;
        }

        return descriptor;
    };
}

export class User extends DynamoClient {
    protected readonly requirements: requirements = {
        delete: ['email'],
        get: ['email'],
        put: ['email', 'sub'],
        register: ['email', 'name', 'password'],
        update: ['email', 'sub']
    }

    protected readonly regex = {
        email: (v: string): boolean => /^([\w\W]+)[@]((\w)+\.){1,}([\w]{2,})+$/.test(v),
        name: (v: string): boolean => /([a-zA-Z]+){2}/.test(v),
        password: (v: string): boolean => /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(v),
        phone: (v: string): boolean => /^([+]1)(\d{10})$/.test(v),
        sub: (v: string): boolean => /^(\w+)\|(\w+$)/.test(v)
    };

    public static associate(token: string, phone: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let request;
            const http = new Http(env.domain);

            try {
                request = await http.post('/mfa/associate', {
                    authenticator_types: ['oob'],
                    client_id: env.id,
                    client_secret: env.secret,
                    oob_channels: ['sms'],
                    phone_number: phone
                }, {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                });
            } catch (error) {
                console.error('associate', error);
                return reject(error);
            }

            resolve(request.oob_code);
        });
    }

    public static auth(email: string, password: string, audience = 'api/v2', scope?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let request;
            const tld = env.domain;
            const http = new Http(tld);

            try {
                request = await http.post('/oauth/token', {
                    grant_type: 'password',
                    username: email,
                    password: password,
                    audience: `https://${tld}/${audience.replace(/\/$/,'')}/`,
                    scope: scope || 'read:current_user update:current_user_metadata delete:current_user_metadata create:current_user_metadata openid',
                    client_id: env.id,
                    client_secret: env.secret
                });
            } catch (error) {
                if (error.error === 'mfa_required') {
                    request = { mfa_token: error.mfa_token };
                } else {
                    console.error('auth', error);
                    return reject(error);
                }
            }

            resolve(request.mfa_token);
        });
    }

    ensureTableExists(config = { readCapacityUnits: 5, writeCapacityUnits: 5 }): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.connection.ensureTableExists(Schema, config)
                .then(resolve)
                .catch(reject);
        });
    }

    @whitelist(['delete', 'get', 'put', 'update'])
    @schema
    execute(...args: unknown[]): Promise<Schema> {
        const method: string = args[0].toString();
        const payload = args[1];

        this.validate(payload, method);

        const fields = Object.keys(payload);
        if (!fields.length) {
            throw new Error(lang.Error.NO_FIELDS);
        }

        return new Promise((resolve, reject) => this.connection[method](payload).then(resolve).catch(reject));
    }

    public static oauth(challenge: string, oob: string, mfa: string): Promise<a0> {
        return new Promise(async (resolve, reject) => {
            let request;
            const http = new Http(env.domain);

            try {
                request = await http.post('/oauth/token', {
                    mfa_token: challenge,
                    oob_code: oob,
                    binding_code: mfa,
                    grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
                    client_id: env.id,
                    client_secret: env.secret
                });
            } catch (error) {
                console.error('oauth', error);
                return reject(error);
            }

            resolve(request);
        });
    }

    public static oob(token: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let request;
            const http = new Http(env.domain);

            try {
                request = await http.post('/mfa/challenge', {
                    mfa_token: token,
                    challenge_type: 'oob',
                    client_id: env.id,
                    client_secret: env.secret
                });
            } catch (error) {
                console.error('oob', error);
                return reject(error);
            }

            resolve(request.oob_code);
        });
    }

    async register(payload: { [key: string]: string }): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            let request;
            const http = new Http(env.domain);

            try {
                this.validate(payload, 'register');
                request = await http.post('/dbconnections/signup', {
                    client_id: env.id,
                    connection: 'Username-Password-Authentication',
                    email: payload.email,
                    ...(payload.name && { name: payload.name }),
                    password: payload.password
                });
            } catch (error) {
                console.error('register', error);
                return reject(error);
            }

            resolve(request);
        });
    }

    async query(needle: { [key: string]: string }, haystack = []): Promise<Schema[]> {
        try {
            for await (const record of this.connection.query(Schema, needle)) {
                haystack.push(record);
            }
        } catch (error) {
            console.error('query', error)
            throw new Error(error);
        }

        return haystack;
    }

    private validate(payload: unknown, method: string) {
        for (const [k, v] of Object.entries(payload)) {
            if (this.requirements[method].includes(k) && (this.regex.hasOwnProperty(k) && !this.regex[k](v))) {
                throw new Error(`${lang.Error.INCORRECT_FIELD}: [${k}, ${v}]`);
            }
        }
    }
}