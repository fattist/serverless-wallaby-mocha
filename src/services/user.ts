import { DynamoClient } from '@helpers/databases/ddb';

import { Schema } from '@entities/user/table';
import { user } from '@entities/user/interfaces';

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
    ensureTableExists(config = { readCapacityUnits: 5, writeCapacityUnits: 5 }): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.connection.ensureTableExists(Schema, config)
                .then(resolve)
                .catch(error => {
                    reject(error);
                });
        });
    }
    
    @whitelist(['delete', 'get', 'put', 'update'])
    @schema
    execute(...args: unknown[]): Promise<Schema> {
        const method: string = args[0].toString();
        const payload = args[1];

        return new Promise((resolve, reject) => {
            this.connection[method](payload)
                .then(resolve).catch(reject);
        });
    }

    async query(needle: { [key: string]: string }, haystack = []): Promise<Schema[]> {
        try {
            for await (const record of this.connection.query(Schema, needle)) {
                haystack.push(record);
            }
        } catch (error) {
            throw new Error(error);
        }

        return haystack;
    }
}