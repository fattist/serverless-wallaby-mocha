import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

export type Response = {
    statusCode: number,
    body: {
        message: string,
        input?: APIGatewayProxyEvent
    },
    isBase64Encoded?: boolean,
    headers?: {
        [key: string]: string
    }
}