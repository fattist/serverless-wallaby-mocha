const env: string = process.env.ENVIRONMENT || 'local';
const local: boolean = env === 'local';

export const dynamodb = {
    endpoint: local ? 'http://localhost:4566' : `dynamodb.${process.env.REGION}.amazonaws.com`,
    region: local ? 'us-east-1' : process.env.REGION
}