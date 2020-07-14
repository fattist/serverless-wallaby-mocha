/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { Context } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

import { Responses as lang } from '@i18n/authorizer';
import { Authorizer, Callback } from '@helpers/interfaces/all';

export const authorize = (event: any, _context: Context, callback: Callback): void => {
    const authToken = stripTokenFromHeader(event, callback);
    const decodedToken = decodeToken(authToken, callback);
    const authClient = jwksClient({
        cache: true,
        jwksUri: `https://${process.env.A0_DOMAIN}/.well-known/jwks.json`
    });

    authenticateToken(authClient, authToken, decodedToken.header.kid, event, callback);
}

export const authenticateToken = (authClient: any, authToken: string, decodedToken: string, event: any, callback: Callback) => {
    authClient.getSigningKey(decodedToken, (error: any, key: any) => {
        if (error) {
            console.error('ERROR', error);
            return callback(lang.ERROR);
        } else {
            const signingKey: string = getSigningKey(key);

            try {
                jwt.verify(authToken, signingKey, {
                    algorithms: process.env.A0_ALGORITHM
                }, (error, decoded) => {
                    if (error) {
                        console.error('VERIFY', error);
                        return callback(lang.UNAUTHORIZED);
                    } else {
                        return callback(null, generatePolicy(decoded, 'Allow', event.methodArn));
                    }
                });
            } catch (error) {
                console.error('EXCEPTION', error);
                return callback(lang.ERROR);
            }
        }
    });
}

export const decodeToken = (token: string, callback: Callback) => {
    let decode;

    try {
        decode = jwt.decode(token, {
            complete: true
        });
    } catch (err) {
        console.error('DECODE', err);
        return callback(lang.ERROR);
    } finally {
        if (!decode) {
            return callback(lang.UNAUTHORIZED);
        } else {
            return decode;
        }
    }
}

export const generatePolicy = (decoded: any, effect?: string, resource?: string): Authorizer => {
    const response: Authorizer = { principalId: decoded.sub };

    if (effect && resource) {
        response.policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: `${resource.split('/').slice(0, 2).join('/')}/*`
            }]
        }

        response.context = decoded;
    }

    return response
}

export const getSigningKey = (key: any): string => key.publicKey || key.rsaPublicKey;

export const stripTokenFromHeader = (event:any, callback: Callback) => {
    if (!event.authorizationToken) {
        return callback(lang.UNAUTHORIZED);
    }

    const authToken = event.authorizationToken.split(' ')[1];

    if (!authToken) {
        return callback(lang.UNAUTHORIZED);
    } else {
        return authToken;
    }
}