import {Filter, REQUEST_TYPE} from "../../src/filter/Filter";
import {Span} from "@opentelemetry/api";

export class SampleFilter extends Filter {
    evaluateUrlAndHeaders(span: Span, url: string | undefined, headers: any, requestType: REQUEST_TYPE): boolean {
        for(const [k, _] of Object.entries(headers)){
            if(k == 'x-filter-test'){
                return true
            }
        }
        return false
    }

    evaluateBodyAndHeaders(span: Span, headers: any, body: string, requestType: REQUEST_TYPE): boolean {
        return body.indexOf('block-this-body') > -1
    }


}