import {Span} from "@opentelemetry/api";

export enum REQUEST_TYPE {
    HTTP = 'http',
    RPC = 'rpc'
}
export abstract class Filter {
    abstract evaluateUrlAndHeaders(span : Span, url: string | undefined, headers: any, requestType: REQUEST_TYPE) : boolean;

    abstract evaluateBodyAndHeaders(span : Span, headers: any, body : string, requestType: REQUEST_TYPE) : boolean
}
