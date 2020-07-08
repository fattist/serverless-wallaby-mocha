/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { Context } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

import * as lang from '@helpers/i18n/authorizer';
import { Authorizer, Callback } from '@helpers/interfaces';

export const authorize = (event: any, _context: Context, callback: Callback): void => {
    const authToken = stripTokenFromHeader(event, callback);
    const decodedToken = decodeToken(authToken, callback);
    const authClient = jwksClient({
        cache: true,
        jwksUri: `https://${process.env.A0_DOMAIN}/.well-known/jwks.json`
    });

    authenticateToken(authClient, authToken, decodedToken.header.kid, event, callback);
}

const authenticateToken = (authClient: any, authToken: string, decodedToken: string, event: any, callback: Callback) => {
    authClient.getSigningKey(decodedToken, (error: any, key: any) => {
        if (error) {
            console.error(error);
            return callback(new Error(lang.INTERNAL_SERVER_ERROR));
        } else {
            const signingKey: string = getSigningKey(key);

            try {
                jwt.verify(authToken, signingKey, {
                    algorithms: process.env.A0_ALGORITHM
                }, (error, decoded) => {
                    if (error) {
                        return callback(new Error(lang.UNAUTHORIZED));
                    } else {
                        return callback(null, generatePolicy(decoded, 'Allow', event.methodArn));
                    }
                });
            } catch (error) {
                console.error('EXCEPTION', error);
                return callback(new Error(lang.UNAUTHORIZED));
            }
        }
    });
}

const decodeToken = (token: string, callback: Callback) => {
    let decode;

    try {
        decode = jwt.decode(token, {
            complete: true
        });
    } catch (err) {
        return callback(new Error(lang.UNPROCESSABLE));
    } finally {
        if (!decode) {
            return callback(new Error(lang.UNAUTHORIZED));
        } else {
            return decode;
        }
    }
}

const generatePolicy = (decoded: any, effect: string, resource: string): Authorizer => {
    const response: Authorizer = { principalId: decoded.sub };

    if (effect && resource) {
        response.policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }]
        }

        response.context = decoded;
    }

    return response
}

const getSigningKey = (key: any): string => (key.publicKey || key.rsaPublicKey);

const stripTokenFromHeader = (event:any, callback: Callback) => {
    if (!event.authorizationToken) {
        return callback(new Error(lang.BAD_REQUEST));
    }

    const authToken = event.authorizationToken.split(' ')[1];
    
    if (!authToken) {
        return callback(new Error(lang.UNAUTHORIZED));
    } else {
        return authToken;
    }
}