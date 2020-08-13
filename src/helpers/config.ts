const env: string = process.env.ENVIRONMENT || 'local';
const local: boolean = env === 'local';

export const auth0 = {
    id: local ? 'foo' : process.env.A0_CLIENT_ID,
    domain: local ? 'foo.bar.baz' : process.env.A0_DOMAIN,
    secret: local ? 'foo' : process.env.A0_CLIENT_SECRET
}

export const dynamodb = {
    endpoint: local ? 'http://localhost:4566' : `dynamodb.${process.env.REGION}.amazonaws.com`,
    region: local ? 'us-east-1' : process.env.REGION
}

export const region = local ? 'us-west-2' : process.env.REGION