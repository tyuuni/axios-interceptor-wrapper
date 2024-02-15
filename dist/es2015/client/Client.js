var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RequestMethod } from "../common";
const assembleLayerWithNext = (layer, next) => {
    return (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield layer(ctx, next);
    });
};
const DEFAULT_60S_TIMEOUT = 60000;
// TODO: add client timeout support
export class HttpClient {
    constructor(axios) {
        this.axios = axios;
        this.layers = [];
    }
    intercept(interceptor) {
        this.layers.unshift(interceptor);
        return this;
    }
    get(url, headers = undefined, timeout = DEFAULT_60S_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRequest = (ctx) => __awaiter(this, void 0, void 0, function* () {
                return this.axios.get(ctx.request.url, {
                    headers: ctx.request.headers,
                    timeout
                });
            });
            // @ts-ignore
            const ctx = {
                request: {
                    method: RequestMethod.GET,
                    url,
                    headers: Object.assign({}, (headers || {}))
                },
                response: undefined,
            };
            yield this.goThroughLayers(ctx, handleRequest);
            return ctx.response;
        });
    }
    put(url, body, headers = undefined, timeout = DEFAULT_60S_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRequest = (ctx) => __awaiter(this, void 0, void 0, function* () {
                return this.axios.put(ctx.request.url, body, {
                    headers: ctx.request.headers,
                    timeout
                });
            });
            // @ts-ignore
            const ctx = {
                request: {
                    method: RequestMethod.PUT,
                    url,
                    headers: Object.assign({}, (headers || {})),
                    body
                },
                response: undefined,
            };
            yield this.goThroughLayers(ctx, handleRequest);
            return ctx.response;
        });
    }
    patch(url, body, headers = undefined, timeout = DEFAULT_60S_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRequest = (ctx) => __awaiter(this, void 0, void 0, function* () {
                return this.axios.patch(ctx.request.url, body, {
                    headers: ctx.request.headers,
                    timeout
                });
            });
            // @ts-ignore
            const ctx = {
                request: {
                    method: RequestMethod.PATCH,
                    url,
                    headers: Object.assign({}, (headers || {})),
                    body
                },
                response: undefined,
            };
            yield this.goThroughLayers(ctx, handleRequest);
            return ctx.response;
        });
    }
    post(url, body, headers = undefined, timeout = DEFAULT_60S_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRequest = (ctx) => __awaiter(this, void 0, void 0, function* () {
                return this.axios.post(ctx.request.url, body, {
                    headers: ctx.request.headers,
                    timeout
                });
            });
            // @ts-ignore
            const ctx = {
                request: {
                    method: RequestMethod.POST,
                    url,
                    headers: Object.assign({}, (headers || {})),
                    body
                },
                response: undefined,
            };
            yield this.goThroughLayers(ctx, handleRequest);
            return ctx.response;
        });
    }
    delete(url, headers = undefined, timeout = DEFAULT_60S_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRequest = (ctx) => __awaiter(this, void 0, void 0, function* () {
                return this.axios.delete(ctx.request.url, {
                    headers: ctx.request.headers,
                    timeout
                });
            });
            // @ts-ignore
            const ctx = {
                request: {
                    method: RequestMethod.DELETE,
                    url,
                    headers: Object.assign({}, (headers || {}))
                },
                response: undefined,
            };
            yield this.goThroughLayers(ctx, handleRequest);
            return ctx.response;
        });
    }
    goThroughLayers(ctx, requestHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            let handler = (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield requestHandler(ctx)
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
                    }
                    else {
                        throw e;
                    }
                });
            });
            for (const layer of this.layers) {
                const previousHandler = handler;
                // @ts-ignore
                handler = assembleLayerWithNext(layer, () => __awaiter(this, void 0, void 0, function* () {
                    yield previousHandler(ctx);
                }));
            }
            yield handler(ctx);
        });
    }
}
