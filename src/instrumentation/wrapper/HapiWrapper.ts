import {Framework} from "../Framework";
import {context, trace} from "@opentelemetry/api";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {BodyCapture} from "../BodyCapture";
import {Config} from "../../config/config";
import {logger} from "../../Logging";

let patched = false
const shimmer = require('shimmer');

function HapiWrapWithConfig(config: any): Function {
    return function (original: Function) {
        const responseBodyEnabled = config.config.data_capture.http_body.response
        const maxCaptureSize = config.config.data_capture.body_max_size_bytes
        return function () {
            let result = arguments[0]
            let request = arguments[1]

            // Ret is a wrapped hapi response object
            let ret = original.apply(this, arguments)

            // if our capture fails just return original response
            try {
                if (responseBodyEnabled) {
                    let capturedChunk = false
                    let span = trace.getSpan(context.active())
                    // @ts-ignore
                    if (span && !span.hapiAlreadyCaptured) {
                        // @ts-ignore
                        let headerContentType = ret._contentType
                        if (HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                            // @ts-ignore
                            span.hapiAlreadyCaptured = true
                            // @ts-ignore
                            let bodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                                Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                            bodyCapture.appendData(result)
                            // @ts-ignore
                            span.setAttribute('http.response.body', bodyCapture.dataString())
                        }
                    }
                }
            } catch {
                return ret
            }
            return ret
        }
    }
}

export function patchHapi() {
    if (!Framework.getInstance().available('@hapi/hapi') || patched) {
        return
    }
    patched = true
    try {
        const hapiResponse = require('@hapi/hapi/lib/response')
        shimmer.wrap(hapiResponse, 'wrap', HapiWrapWithConfig(Config.getInstance()))
    }catch(e){
        logger.debug("Could not configure hapi response listener - continuing without hapi instrumentation")
    }



}