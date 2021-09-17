import * as express from 'express'
import {context, trace} from "@opentelemetry/api";
import {FunctionWrapper} from "../FunctionWrapper";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";

function WrapSendWithConfig(config : any) : Function {
    const responseBodyEnabled = config.config.data_capture.http_body.response
    return function sendWrapper(data: any) {
        if(responseBodyEnabled) {
            let span = trace.getSpan(context.active())
            if(span) {
                // @ts-ignore
                let headerContentType =  this.get('Content-Type')
                if(HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                    span.setAttribute('http.response.body', data.toString())
                }
            }
        }
        // @ts-ignore
        return this.ht_send(data)
    }
}

function WrapJsonWithConfig(config: any) : Function {
    const responseBodyEnabled = config.config.data_capture.http_body.response
    return function jsonWrapper(data: any) {
        if(responseBodyEnabled) {
            let span = trace.getSpan(context.active())
            if(span) {
                // @ts-ignore
                let headerContentType = this.get('Content-Type')
                if(HttpInstrumentationWrapper.isRecordableContentType(headerContentType)) {
                    span.setAttribute('http.response.body', data.toString())
                }
            }
        }
        // @ts-ignore
        return this.ht_json(data)
    }
}

const sendWrapper = new FunctionWrapper(express.response, "send", WrapSendWithConfig(Config.getInstance()))
const jsonWrapper = new FunctionWrapper(express.response, 'json', WrapJsonWithConfig(Config.getInstance()))

export function patchExpress(){
    sendWrapper.patch()
    jsonWrapper.patch()
}