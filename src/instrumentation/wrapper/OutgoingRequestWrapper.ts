import { Span} from "@opentelemetry/api";
import {Config} from "../../config/config";
import {BodyCapture} from "../BodyCapture";
import {ClientRequest} from "http";
const shimmer = require('shimmer');

export function ResponseCaptureWithConfig(config : any) : Function {
    return function (original : Function) {
        const maxCaptureSize = config.config.data_capture.body_max_size_bytes
        return function(){
            // @ts-ignore
            if(this.hypertraceSpan) {
                let bodyCapture : BodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                    Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                bodyCapture.appendData(arguments[0])
                // @ts-ignore
                this.hypertraceSpan.setAttribute('http.request.body', bodyCapture.dataString())
            }
            // @ts-ignore
            return original.apply(this, arguments)
        }
    }
}

export function patchClientRequest(){
    Object.defineProperty(ClientRequest.prototype, 'hypertraceSpan', {
        value: undefined,
        writable: true
    })
    shimmer.wrap(ClientRequest.prototype, "write", ResponseCaptureWithConfig(Config.getInstance()))
}