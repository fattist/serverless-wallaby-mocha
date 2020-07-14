export type Response = {
    statusCode: number,
    body: {
        expiration: Date,
        user: { [key: string]: any }
    },
    isBase64Encoded?: boolean,
    headers?: {
        [key: string]: string
    }
}