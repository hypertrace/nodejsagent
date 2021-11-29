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
        if(url || headers) {
            for(let filter of this.filters) {
                if(filter.evaluateUrlAndHeaders(span, url, headers, requestType)) {
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
}