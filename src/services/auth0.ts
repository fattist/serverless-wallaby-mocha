import { AxiosResponse } from 'axios';
import { HttpClient as A0HttpClient } from '@helpers/axios/interceptor';
import { UserInfo } from '@helpers/interfaces/auth0';

export class A0 extends A0HttpClient {
    constructor(domain:string, bearerToken: string, contentType?: string) {
        super(`https://${domain}`, bearerToken, contentType);
    }

    public me = (): Promise<AxiosResponse<UserInfo>> => this.instance.get('/userinfo');
}