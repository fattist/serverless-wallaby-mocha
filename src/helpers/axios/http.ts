import axios, { AxiosInstance } from 'axios';

export abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });
    }
}