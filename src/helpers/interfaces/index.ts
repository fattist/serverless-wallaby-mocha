import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

export interface Route {
    [key: string]: APIGatewayProxyHandler
}