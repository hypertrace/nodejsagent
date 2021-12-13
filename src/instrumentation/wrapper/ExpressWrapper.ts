import {context, trace} from "@opentelemetry/api";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {BodyCapture} from "../BodyCapture";
import {MESSAGE} from "../../filter/Filter";
import {logger} from "../../Logging";

const shimmer = require('shimmer');
export function available(mod : string){
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
        if(span && span.inHtScope != true) {

            // @ts-ignore
            let headerContentType =  response.get('Content-Type')
            if(HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                // @ts-ignore
                let bodyCapture : BodyCapture = span.hypertraceBodyCapture ||  new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                    Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                if(response.get('Content-Length') == bodyCapture.getContentLength()){ return }
                bodyCapture.appendData(responseEndArgs[0])
                span.setAttribute('http.response.body', bodyCapture.dataString())
            }
        }
    } catch (e) {
        logger.debug('error capturing resp body', e)
    }

}

function ResponseCaptureWithConfig(config : any) : Function {
    return function (original : Function) {
        const responseBodyEnabled = config.config.data_capture.http_body.response
        const maxCaptureSize = config.config.data_capture.body_max_size_bytes
        return function(){
            let span = trace.getSpan(context.active())
            if(responseBodyEnabled) {
                if(span) {
                    // @ts-ignore
                    let headerContentType =  this.get('Content-Type')
                    if(HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                        let bodyCapture : BodyCapture;
                        // @ts-ignore
                        if(span.hypertraceBodyCapture) {
                            // @ts-ignore
                            bodyCapture = span.hypertraceBodyCapture;
                        } else {
                            bodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                                Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                            // @ts-ignore
                            span.hypertraceBodyCapture = bodyCapture;
                        }

                        bodyCapture.appendData(arguments[0])
                        span.setAttribute('http.response.body', bodyCapture.dataString())
                    }
                }
            }
            // @ts-ignore
            return original.apply(this, arguments)
        }
    }
}

export function patchExpress(){
    if(!available('express')){
        return
    }
    const express = require('express')
    shimmer.wrap(express.response, 'send', ResponseCaptureWithConfig(Config.getInstance()))
    shimmer.wrap(express.response, 'json', ResponseCaptureWithConfig(Config.getInstance()))
}