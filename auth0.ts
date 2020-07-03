import { Context } from 'aws-lambda';
import jwk from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import * as request from 'request';

import { Authorizer, Callback } from '@helpers/interfaces';
import * as lang from '@helpers/i18n/authorizer';

const iss = 'https://mhp.us.auth0.com';

const generatePolicy = (pid: string, effect: string, resource: string): Authorizer => {
    const response: Authorizer = { principalId: pid };

    if (effect && resource) {
        response.policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: resource,
                Resource: resource
            }]
        }
    }

    return response;
}

export const authorize = (event: any, _context: Context, _callback: Callback) => {
    let token = event.authorizationToken;

    if (!token) {
        _callback(lang.UNAUTHORIZED);
    } else {
        token = token.substring(7);
        request(
            { url: `${iss}/.well-known/jwks.json`, json: true },
            (error: string, response: any, body: Array<string>) => {
                if (error || response.statusCode !== 200) {
                    _callback(lang.UNAUTHORIZED);
                } else {
                    const k = body.keys[0];
                    const pem = jwkToPem({ kty: k.kty, n: k.n, e: k.e });

                    jwk.verify(token, pem, { issuer: iss }, (error, decoded) => {
                        if (error) {
                            _callback(lang.UNAUTHORIZED);
                        } else {
                            _callback( null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
                        }
                    });
                }
            }
        )
    }
}