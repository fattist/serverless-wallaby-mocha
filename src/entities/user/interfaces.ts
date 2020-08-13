export interface a0 {
    access_token: string,
    id_token: string,
    scope: string,
    expires_in: string | number,
    token_type: string
}

export interface requirements {
    [key: string]: string[]
}

export interface user {
    createdAt?: Date,
    email: string,
    phone: string,
    sub: string
}