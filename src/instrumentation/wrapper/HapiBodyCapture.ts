import {HttpInstrumentationWrapper} from "../HttpInstrumentationWrapper";
import {BodyCapture} from "../BodyCapture";
import {Config} from "../../config/config";
import {Registry} from "../../filter/Registry";
import {REQUEST_TYPE} from "../../filter/Filter";


export function captureWithFilter(span, request) {
    if (!span || !request) {
        return false
    }

    if (request.headers) {
        const contentType = request.headers['content-type']
        if (HttpInstrumentationWrapper.isRecordableContentType(contentType)){
            let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
                <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
            bodyCapture.appendData(request.payload)
            span.setAttribute('http.request.body', bodyCapture.dataString())

            const url = createHapiUrl(request)
            let filterResult = Registry.getInstance().applyFilters(span!,
                url,
                request.headers,
                bodyCapture.processableString(),
                REQUEST_TYPE.HTTP
            )
            return filterResult
        }
    }
    return false
}

function createHapiUrl(request){
    return `${request.url}`
}

export function captureResponse(span, hapiToolkit, response) {
    if (!span) {
        return
    }
    if (response && response._contentType && HttpInstrumentationWrapper.isRecordableContentType(response._contentType)) {
        let bodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
            Config.getInstance().config.data_capture.body_max_processing_size_bytes)

        bodyCapture.appendData(response.source)
        span.setAttribute("http.response.body", bodyCapture.dataString())
    }
}