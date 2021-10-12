import {BodyCapture} from "../BodyCapture";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";

export function koaRequestCallback(context: any, span: any) {
    if (!span) { return }
    let reqHeaders = context.request.headers
    if(Config.getInstance().config.data_capture.http_headers.request) {
        for (const [key, value] of Object.entries(reqHeaders)) {
            span.setAttribute(`http.request.header.${key}`, <string>value)
        }
    }

    const reqBodyCaptureEnabled = Config.getInstance().config.data_capture.http_body.request
    if(!reqBodyCaptureEnabled) { return }

    if(HttpInstrumentationWrapper.isRecordableContentType(reqHeaders['content-type'])) {
        const bodyData = context.request.rawBody
        if(bodyData){
            let bodyCapture : BodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes)
            bodyCapture.appendData(bodyData)
            span.setAttribute("http.request.body", bodyCapture.dataString())
        }
    }
}

export function koaResponseCallback(context: any, span: any) {
    if(!span){
        return
    }
    let reqHeaders = context.res.getHeaders()
    if(Config.getInstance().config.data_capture.http_headers.response, reqHeaders) {
        for (const [key, value] of Object.entries(reqHeaders)) {
            span.setAttribute(`http.response.header.${key}`, <string>value)
        }
    }

    const respBodyCaptureEnabled = Config.getInstance().config.data_capture.http_body.response
    if(!respBodyCaptureEnabled) { return }

    if(HttpInstrumentationWrapper.isRecordableContentType(reqHeaders['content-type'])) {
        const bodyData = context.response._body
        if(bodyData){
            let bodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes);
            bodyCapture.appendData(context.response._body)
            span.setAttribute('http.response.body', bodyCapture.dataString())
        }
    }
}