import { Span} from "@opentelemetry/api";
import {Config} from "../../config/config";
import {BodyCapture} from "../BodyCapture";

export function ResponseCaptureWithConfig(span : Span, config : any) : Function {
    return function (original : Function) {
        const maxCaptureSize = config.config.data_capture.body_max_size_bytes
        const reqSpan = span
        return function(){
            if(reqSpan) {
                let bodyCapture : BodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes)
                bodyCapture.appendData(arguments[0])
                reqSpan.setAttribute('http.request.body', bodyCapture.dataString())
            }
            // @ts-ignore
            return original.apply(this, arguments)
        }
    }
}