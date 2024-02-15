import { BiConsumer, Generator } from "../common";
import { HttpRequestContext, HttpResponse, HttpHeader } from "../common";
import { AxiosInstance } from 'axios';
export type Interceptor<T> = BiConsumer<HttpRequestContext<T>, Generator<void>>;
export declare class HttpClient<T> {
    private readonly layers;
    private readonly axios;
    constructor(axios: AxiosInstance);
    intercept(interceptor: Interceptor<HttpRequestContext<T>>): HttpClient<T>;
    get<R extends HttpResponse>(url: string, headers?: HttpHeader, timeout?: number): Promise<R>;
    put<R extends HttpResponse>(url: string, body: object, headers?: HttpHeader, timeout?: number): Promise<R>;
    patch<R extends HttpResponse>(url: string, body: object, headers?: HttpHeader, timeout?: number): Promise<R>;
    post<R extends HttpResponse>(url: string, body: object, headers?: HttpHeader, timeout?: number): Promise<R>;
    delete<R extends HttpResponse>(url: string, headers?: HttpHeader, timeout?: number): Promise<R>;
    private goThroughLayers;
}
