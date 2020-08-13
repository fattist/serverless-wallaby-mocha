/* eslint-disable @typescript-eslint/no-var-requires */
const { graphql } = require('graphql');
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { resolvers } from '@entities/user/resolvers';
import { schema } from '@entities/user/schema';
import { parse } from '@helpers/body';
import { contentTypeCheck } from '@helpers/headers';
import { response } from '@helpers/response';
import { Authorizer as auth_lang } from '@i18n/authorizer';
import { Registration as reg_lang } from '@i18n/registration';
import { User } from '@services/user';

export const graph = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let request;

    try {
        contentTypeCheck(event.headers['Content-Type'], 'application/json');
        request = await graphql(schema, parse(event.body), resolvers);
    } catch (error) {
        console.log('exception');
        return response(400, error, true);
    } finally {
        if (request.hasOwnProperty('errors') && request.errors.length) {
            return response(400, request.errors[0]);
        }
    }

    return response(200, { ...request });
}

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            const [email, password] = Buffer.from(event.headers.Authorization.split(' ')[1], 'base64').toString().split(':');
            const mfa_challenge = await User.auth(email, password);
            const oob_code = await User.oob(mfa_challenge);

            return response(200, { mfa_challenge, oob_code });
        } else {
            const { mfa_challenge, oob_code, mfa_code } = JSON.parse(event.body);

            if (mfa_challenge && oob_code && mfa_code) {
                const authentication = await User.oauth(mfa_challenge, oob_code, mfa_code);
                return response(200, { ...authentication });
            } else {
                return response(403, auth_lang.UNAUTHORIZED);
            }
        }
    } catch (error) {
        return response(400, error, true);
    }
}

export const associate = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = JSON.parse(event.body);

    try {
        const [email, password] = Buffer.from(event.headers.Authorization.split(' ')[1], 'base64').toString().split(':');
        const mfa_challenge = await User.auth(email, password, 'mfa', 'enroll');
        const oob_code = await User.associate(mfa_challenge, payload.phone_number);
        return response(200, { mfa_challenge, oob_code });
    } catch (error) {
        return response(400, error, true);
    }
}


export const register = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = parse(event.body);

    if (payload.includes('register')) {
        return graph(event);
    } else {
        return response(400, reg_lang.INCORRECT_REQUEST);
    }
}