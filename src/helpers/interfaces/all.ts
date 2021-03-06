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
    },
    context?: { [key: string]: any }
}

export interface Callback { (err: any|null, handler?: any): void }

export interface Generic {
    [key: string]: unknown
}

export interface Response {
    statusCode: number,
    body: string
}

export interface Route {
    [key: string]: APIGatewayProxyHandler
}