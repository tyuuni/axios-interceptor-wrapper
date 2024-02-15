import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
export declare enum RequestMethod {
    HEAD = "HEAD",
    GET = "GET",
    PATCH = "PATCH",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}
export type HttpHeader = {
    [key: string]: string;
};
export type HttpRequestWithNoBody = {
    method: RequestMethod.GET | RequestMethod.HEAD | RequestMethod.DELETE;
    url: string;
    headers: HttpHeader;
};
export type HttpRequestWithBody = {
    method: RequestMethod.PUT | RequestMethod.PATCH | RequestMethod.POST;
    url: string;
    headers: HttpHeader;
    body: any;
};
export type HttpRequest = HttpRequestWithNoBody | HttpRequestWithBody;
export type HttpResponse = {
    status: number;
    headers: AxiosResponseHeaders | RawAxiosResponseHeaders;
    body: any;
};
export type HttpRequestContext<T> = T & {
    request: HttpRequest;
    response: HttpResponse;
};
export * from './abstractions';
