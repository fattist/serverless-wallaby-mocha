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

export interface Route {
    [key: string]: APIGatewayProxyHandler
}

export interface UserInfo {
    sub: string,
    nickname: string,
    name: string,
    picture: string,
    updated_at: Date,
    email: string,
    email_verified: boolean
}