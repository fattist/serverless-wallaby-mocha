import { APIGatewayProxyResult } from 'aws-lambda';

// TODO: define abstract class for baseline alpha

export const routes = {
    register: async (): Promise<APIGatewayProxyResult> => {
        const payload = { statusCode: 200, body: { foo: "bar" } };
        return { ...payload, body: JSON.stringify(payload.body, null, 2) };
    }
}