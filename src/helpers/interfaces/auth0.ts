export interface Error {
    [key: string]: { [key: string]: string }
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