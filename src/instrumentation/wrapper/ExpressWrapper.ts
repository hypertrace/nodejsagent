const express = require("express");
import {context, trace} from "@opentelemetry/api";
import {FunctionWrapper} from "../FunctionWrapper";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {BodyCapture} from "../BodyCapture";

const shimmer = require('shimmer');

function ResponseCaptureWithConfig(config : any) : Function {
    return function (original : Function) {
        const responseBodyEnabled = config.config.data_capture.http_body.response
        const maxCaptureSize = config.config.data_capture.body_max_size_bytes
        return function(){
            if(responseBodyEnabled) {
                let span = trace.getSpan(context.active())
                if(span) {
                    // @ts-ignore
                    let headerContentType =  this.get('Content-Type')
                    if(HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                        let bodyCapture : BodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes)
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
    shimmer.wrap(express.response, 'send', ResponseCaptureWithConfig(Config.getInstance()))
    shimmer.wrap(express.response, 'json', ResponseCaptureWithConfig(Config.getInstance()))
}

export function unpatchExpress(){
    shimmer.unwrap(express.response, 'send')
    shimmer.unwrap(express.response, 'json')
}