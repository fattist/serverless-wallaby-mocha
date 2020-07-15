import { Response } from '@helpers/types/router';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// TODO: define abstract class for baseline alpha

export const routes = {
    index: async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const exp = new Date(event.requestContext.authorizer.exp * 1000);
        const payload: Response = { statusCode: 200, body: { expiration: exp, user: event.requestContext } };
        return { ...payload, body: JSON.stringify(payload.body, null, 2) };
    }
}