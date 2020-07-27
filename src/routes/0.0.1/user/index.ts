/* eslint-disable @typescript-eslint/no-var-requires */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const { graphql } = require('graphql');

import { resolvers } from '@entities/user/resolvers';
import { schema } from '@entities/user/schema';

export const routes = {
    graph: async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        let body = {};
        const response = { statusCode: 200 };

        try {
            const query = await graphql(schema, event.body, resolvers);
            body = { ...query.data };
        } catch (error) {
            response.statusCode = 500;
            body = { error: error };
        }

        return { ...response, body: JSON.stringify(body, null, 2) };

    },
    register: async (): Promise<APIGatewayProxyResult> => {
        const payload = { statusCode: 200, body: { foo: "bar" } };
        return { ...payload, body: JSON.stringify(payload.body, null, 2) };
    }
}