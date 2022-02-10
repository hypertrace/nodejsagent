import {context, trace} from "@opentelemetry/api";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {BodyCapture} from "../BodyCapture";
import {logger} from "../../Logging";

let patched = false
const shimmer = require('shimmer');

export function available(mod: string) {
    try {
        require.resolve(mod)
        return true
    } catch {
        return false
    }
}

export function ResponseEnded(span, response, responseEndArgs) {
    try { // this call happens within a SafeExecuteInTheMiddle;
        // a raised exception will prevent the original resp.apply.end from being applied
        // which would cause some of the response not to write to client
        if (span) {
            // @ts-ignore
            if (span.inHtCaptureScope != true) {
                // @ts-ignore
                let headerContentType = response.get('Content-Type')
                if (HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                    // @ts-ignore
                    let bodyCapture: BodyCapture = span.hypertraceBodyCapture || new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                        Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                    // the response may have been chunked during send & nested end call;
                    // if so & content lengths are the same, we already captured entire body
                    if (response.get('Content-Length') == bodyCapture.getContentLength().toString()) {
                        return
                    }
                    bodyCapture.appendData(responseEndArgs[0])
                    span.setAttribute('http.response.body', bodyCapture.dataString())
                }
            }
        }
    } catch (e) {
        logger.debug('error capturing resp body', e)
    }

}

function ResponseCaptureWithConfig(config: any): Function {
    return function (original: Function) {
        const responseBodyEnabled = config.config.data_capture.http_body.response
        const maxCaptureSize = config.config.data_capture.body_max_size_bytes
        return function () {
            let capturedChunk = false
            let span = trace.getSpan(context.active())
            if (responseBodyEnabled) {
                if (span) {
                    // @ts-ignore
                    if (span.inHtCaptureScope != true) {
                        // @ts-ignore
                        let headerContentType = this.get('Content-Type')
                        if (HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                            // @ts-ignore
                            if (!span.hypertraceBodyCapture) {
                                // @ts-ignore
                                span.hypertraceBodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                                    Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                            }
                            // @ts-ignore
                            span.hypertraceBodyCapture.appendData(arguments[0])
                            capturedChunk = true
                            // @ts-ignore
                            span.setAttribute('http.response.body', span.hypertraceBodyCapture.dataString())
                        }
                    }
                }
            }
            // sometimes we can't capture a chunk at a certain scope because content-type isn't set yet,
            // in that case we dont want to enter scope until we have captured
            // @ts-ignore
            span.inHtCaptureScope = capturedChunk;
            let ret = original.apply(this, arguments)
            // @ts-ignore
            span.inHtCaptureScope = false;
            return ret
        }
    }
}

export function patchExpress() {
    if (!available('express') || patched) {
        return
    }
    patched = true
    const express = require('express')

    shimmer.wrap(express.response, 'send', ResponseCaptureWithConfig(Config.getInstance()))
}