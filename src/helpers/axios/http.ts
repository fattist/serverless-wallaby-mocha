import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Error } from '@helpers/interfaces/auth0';

export abstract class HttpClient {
    private readonly contentType: string;
    protected readonly instance: AxiosInstance;

    constructor(baseURL: string, contentType = 'application/json') {
        this.instance = axios.create({
            baseURL,
        });

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

    protected _handleError = (error: Error): Promise<string> => Promise.reject(error.response.data);
    private _handleResponse = ({ data }: AxiosResponse) => data;
    private _handleRequest = (config: AxiosRequestConfig) => {
        config.headers.get['Content-Type'] = this.contentType;
        config.headers.post['Content-Type'] = this.contentType;

        return config;
    };
}