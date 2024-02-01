import {
    UnaryOperator,
    AsyncTransformer,
    BiConsumer,
    Generator
} from "../common";
import { HttpRequestContext, HttpRequest, HttpResponse, RequestMethod, HttpHeader } from "../common";
import { AxiosInstance, AxiosResponse } from 'axios';

export type Interceptor<T> = BiConsumer<HttpRequestContext<T>, Generator<void>>;

const assembleLayerWithNext = <T>(layer: Interceptor<T>, next: Generator<void>): UnaryOperator<HttpRequestContext<T>, Promise<void>> => {
    return async (ctx) => {
        await layer(ctx, next);
    };
};

const DEFAULT_60S_TIMEOUT = 60000;

// TODO: add client timeout support
export class HttpClient<T> {
    private readonly layers: Interceptor<T>[];
    private readonly axios: AxiosInstance;

    constructor(axios: AxiosInstance) {
        this.axios = axios;
        this.layers = [];
    }

    public intercept(interceptor: Interceptor<HttpRequestContext<T>>): HttpClient<T> {
        this.layers.unshift(interceptor);
        return this;
    }

    public async get<R extends HttpResponse>(url: string,
        headers: HttpHeader = undefined,
        timeout = DEFAULT_60S_TIMEOUT): Promise<R> {
        const handleRequest = async (ctx: HttpRequestContext<T>) => {
            return this.axios.get(ctx.request.url, {
                headers: ctx.request.headers,
                timeout
            });
        };
        // @ts-ignore
        const ctx: HttpRequestContext<T> = {
            request: {
                method: RequestMethod.GET,
                url,
                headers: {
                    ...(headers || {})
                }
            },
            response: undefined,
        };
        await this.goThroughLayers(ctx, handleRequest);
        return ctx.response as R;
    }

    public async put<R extends HttpResponse>(url: string,
        body: object,
        headers: HttpHeader = undefined,
        timeout = DEFAULT_60S_TIMEOUT): Promise<R> {
        const handleRequest = async (ctx: HttpRequestContext<T>) => {
            return this.axios.put(ctx.request.url, body, {
                headers: ctx.request.headers,
                timeout
            });
        };
        // @ts-ignore
        const ctx: HttpRequestContext<T> = {
            request: {
                method: RequestMethod.PUT,
                url,
                headers: {
                    ...(headers || {})
                },
                body
            },
            response: undefined,
        };
        await this.goThroughLayers(ctx, handleRequest);
        return ctx.response as R;
    }

    public async patch<R extends HttpResponse>(url: string,
        body: object,
        headers: HttpHeader = undefined,
        timeout = DEFAULT_60S_TIMEOUT): Promise<R> {
        const handleRequest = async (ctx: HttpRequestContext<T>) => {
            return this.axios.patch(ctx.request.url, body, {
                headers: ctx.request.headers,
                timeout
            });
        };
        // @ts-ignore
        const ctx: HttpRequestContext<T> = {
            request: {
                method: RequestMethod.PATCH,
                url,
                headers: {
                    ...(headers || {})
                },
                body
            },
            response: undefined,
        };
        await this.goThroughLayers(ctx, handleRequest);
        return ctx.response as R;
    }

    public async post<R extends HttpResponse>(url: string,
        body: object,
        headers: HttpHeader = undefined,
        timeout = DEFAULT_60S_TIMEOUT): Promise<R> {
        const handleRequest = async (ctx: HttpRequestContext<T>) => {
            return this.axios.post(ctx.request.url, body, {
                headers: ctx.request.headers,
                timeout
            });
        };
        // @ts-ignore
        const ctx: HttpRequestContext<T> = {
            request: {
                method: RequestMethod.POST,
                url,
                headers: {
                    ...(headers || {})
                },
                body
            },
            response: undefined,
        };
        await this.goThroughLayers(ctx, handleRequest);
        return ctx.response as R;
    }

    public async delete<R extends HttpResponse>(url: string,
        headers: HttpHeader = undefined,
        timeout = DEFAULT_60S_TIMEOUT): Promise<R> {
        const handleRequest = async (ctx: HttpRequestContext<T>) => {
            return this.axios.delete(ctx.request.url, {
                headers: ctx.request.headers,
                timeout
            });
        };
        // @ts-ignore
        const ctx: HttpRequestContext<T> = {
            request: {
                method: RequestMethod.DELETE,
                url,
                headers: {
                    ...(headers || {})
                }
            },
            response: undefined,
        };
        await this.goThroughLayers(ctx, handleRequest);
        return ctx.response as R;
    }

    private async goThroughLayers<T, R>(ctx: HttpRequestContext<T>, requestHandler: AsyncTransformer<HttpRequestContext<T>, AxiosResponse>): Promise<void> {
        let handler = async (ctx: HttpRequestContext<T>) => {
            await requestHandler(ctx)
                .then(response => {
                    ctx.response = {
                        status: response.status,
                        headers: response.headers,
                        body: response.data
                    };
                })
                .catch(e => {
                    if (e.response) {
                        ctx.response = {
                            status: e.response.status,
                            headers: e.response.headers,
                            body: e.response.data,
                        };
                    } else {
                        throw e;
                    }
                });
        }
        for (const layer of this.layers) {
            const previousHandler = handler;
            // @ts-ignore
            handler = assembleLayerWithNext(layer, async () => {
                await previousHandler(ctx);
            });
        }
        await handler(ctx);
    }

}
