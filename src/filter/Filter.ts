import {Span} from "@opentelemetry/api";

export const MESSAGE = 'FORBIDDEN';
export const STATUS_CODE = 403;

export function filterError() : Error{
    let e = new Error(MESSAGE)
    // @ts-ignore
    e.status = STATUS_CODE
    // @ts-ignore
    e.statusCode = STATUS_CODE
    return e
}

export enum REQUEST_TYPE {
    HTTP = 'http',
    RPC = 'rpc'
}
export abstract class Filter {
    abstract evaluateUrlAndHeaders(span : Span, url: string | undefined, headers: any, requestType: REQUEST_TYPE) : boolean;

    abstract evaluateBodyAndHeaders(span : Span, headers: any, body : string, requestType: REQUEST_TYPE) : boolean
}
