import { AxiosResponse } from 'axios';
import { HttpClient } from '@helpers/axios/http';

export class httpWrapper extends HttpClient {
    constructor(domain:string, protocol = 'https') {
        super(`${protocol}://${domain}`);
    }

    public get(uri: string, headers?: { [key: string]: string }): Promise<AxiosResponse<unknown>> {
        const request = headers ? this.instance.get(uri, headers) : this.instance.get(uri);
        return request;
    }

    public post(uri: string, data: unknown, headers?: { [key: string]: string }): Promise<AxiosResponse<unknown>> {
        const request = headers ? this.instance.post(uri, data, { headers }) : this.instance.post(uri, data);
        return request;
    }
}