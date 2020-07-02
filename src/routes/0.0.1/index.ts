import { Response } from '@helpers/types/router';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// TODO: define abstract class for baseline alpha

export const defaults = {
    index: async (event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {
        const message = 'index';
        const payload: Response = { statusCode: 200, body: { message: message, input: event } };
        return { ...payload, body: JSON.stringify(payload.body, null, 2) };
    }
}