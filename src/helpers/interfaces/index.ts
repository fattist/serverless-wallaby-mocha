import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

export interface Authorizer {
    principalId: string,
    policyDocument?: {
        Version: string,
        Statement: [{
            Action: string,
            Effect: string,
            Resource: string
        }]
    }
}

export interface Callback { (err: string|null, handler?: any): void }

export interface Route {
    [key: string]: APIGatewayProxyHandler
}