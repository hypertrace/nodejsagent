import {BodyCapture} from "../BodyCapture";
import {Config} from "../../config/config";
import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {Registry} from "../../filter/Registry";
import {MESSAGE, REQUEST_TYPE, STATUS_CODE} from "../../filter/Filter";

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
    let bodyCapture : BodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
        Config.getInstance().config.data_capture.body_max_processing_size_bytes)

    if(HttpInstrumentationWrapper.isRecordableContentType(reqHeaders['content-type'])) {
        const bodyData = context.request.rawBody
        if(bodyData){
            bodyCapture.appendData(bodyData)
            span.setAttribute("http.request.body", bodyCapture.dataString())
        }
    }

    const filterResult = Registry.getInstance().applyFilters(span,
        context.originalUrl,
        reqHeaders,
        bodyCapture.dataString(),
        REQUEST_TYPE.HTTP )
    if(filterResult){
        context.throw(STATUS_CODE, MESSAGE);
    }
}

export function koaResponseCallback(context: any, span: any) {
    if(!span){
        return
    }
    let resHeaders = context.res.getHeaders()
    if(Config.getInstance().config.data_capture.http_headers.response, resHeaders) {
        for (const [key, value] of Object.entries(resHeaders)) {
            span.setAttribute(`http.response.header.${key}`, <string>value)
        }
    }

    const respBodyCaptureEnabled = Config.getInstance().config.data_capture.http_body.response
    if(!respBodyCaptureEnabled) { return }

    if(HttpInstrumentationWrapper.isRecordableContentType(resHeaders['content-type'])) {
        const bodyData = context.response._body
        if(bodyData){
            let bodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                Config.getInstance().config.data_capture.body_max_processing_size_bytes);
            bodyCapture.appendData(context.response._body)
            span.setAttribute('http.response.body', bodyCapture.dataString())
        }
    }
}