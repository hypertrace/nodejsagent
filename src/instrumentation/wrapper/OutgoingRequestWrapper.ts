import {logger} from "../../Logging";

const express = require("express");
import {context, Span, trace} from "@opentelemetry/api";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {BodyCapture} from "../BodyCapture";
import {OutgoingMessage} from "http";
import {AgentForTest} from "../../../test/instrumentation/AgentForTest";
import {ROOT_CONTEXT} from "@opentelemetry/api/build/src/context/context";

const shimmer = require('shimmer');

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