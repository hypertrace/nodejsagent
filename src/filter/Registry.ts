import {IFilter, REQUEST_TYPE} from "./Filter";
import {Span} from "@opentelemetry/api";

export class Registry {

    private static instance: Registry | undefined;
    private readonly filters : IFilter[]

    private constructor() {
        this.filters = []
    }

    public static getInstance(): Registry {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }

        return Registry.instance;
    }

    public register(filter_instance : IFilter) {
        this.filters.push(filter_instance)
    }

    public applyFilters(span: Span, url: string | undefined, headers: any, body: string | undefined, requestType: REQUEST_TYPE) : boolean {
        let rebuiltUrl = this.getUrl(span)
        span.setAttribute("http.url", rebuiltUrl)
        if(url || headers) {
            for(let filter of this.filters) {
                if(filter.evaluateUrlAndHeaders(span, rebuiltUrl, headers, requestType)) {
                    return true
                }
            }
        }
        if(body) {
            for(let filter of this.filters) {
                if(filter.evaluateBodyAndHeaders(span, headers, body, requestType)){
                    return true
                }
            }
        }

        return false
    }

    private getUrl(span: Span) : string {
        // @ts-ignore
        let scheme = span.attributes['http.scheme']
        if (!scheme) {
            return "";
        }
        // @ts-ignore
        let host = span.attributes['net.host.name']
        if (!host) {
            return "";
        }

        // @ts-ignore
        let target = span.attributes['http.target']
        if (!target) {
            return "";
        }

        let url = scheme + "://" + host;

        // @ts-ignore
        let port = span.attributes['net.host.port']
        if (port) {
            url = url + ":" + port;
        }

        url = url + target;
        return url;
    }
}