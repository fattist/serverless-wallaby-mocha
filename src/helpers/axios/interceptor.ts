/* eslint-disable @typescript-eslint/no-empty-interface */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios' {
    interface AxiosResponse<T=any> extends Promise<T> { }
}

export abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    private readonly bearerToken: string;
    private readonly contentType: string;

    constructor(baseURL: string, bearerToken: string, contentType = 'application/json') {
        this.instance = axios.create({
            baseURL,
        });

        this.bearerToken = bearerToken;
        this.contentType = contentType;

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    private _initializeRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleRequest,
            this._handleError,
        );
    };

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    protected _handleError = (error: any) => Promise.reject(error.response.data);
    private _handleResponse = ({ data }: AxiosResponse) => data;
    private _handleRequest = (config: AxiosRequestConfig) => {
        config.headers['Authorization'] = `Bearer ${this.bearerToken}`;
        config.headers.get['Content-Type'] = this.contentType;

        return config;
    };
}