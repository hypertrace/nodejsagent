import {SemanticAttributes} from "@opentelemetry/semantic-conventions";
import {BodyCapture, shouldCapture} from "../BodyCapture";
import {Config} from "../../config/config";
import {logger} from "../../Logging";
import {SpanKind} from "@opentelemetry/api";
const {context, trace} = require('@opentelemetry/api');

let PATCHED = false;

export function patchFetch() {
    if (typeof fetch !== 'undefined') {
        logger.info("Adding fetch patch")
    } else {
        return
    }
    if(PATCHED){
        return
    } else {
        PATCHED = true
    }
    const originalFetch = fetch;
    global.fetch = async function (urlOrRequest: RequestInfo, options: RequestInit = {}) {
        let response
        let span = startSpanFromRequest(urlOrRequest, options)
        try {
            response = await originalFetch(urlOrRequest, options);
        } catch(e){
            if(span){
                span.recordException(e);
                span.end()
            }
            // re-raise underlying fetch error
            throw e
        }

        if (span === null) {
            // this means something errored during req cap, just return response to caller without res cap
            return response;
        } else {
            await recordResponseData(span, response)
        }
        return response
    };
}

function startSpanFromRequest(urlOrRequest: RequestInfo, options: RequestInit = {}) {
    let span;
    try {
        let url: URL;
        let optionsToUse = options;

        // Handle if urlOrRequest is a Request object
        if (urlOrRequest instanceof Request) {
            url = new URL(urlOrRequest.url);
            optionsToUse = {
                ...options,
                method: urlOrRequest.method,
                headers: urlOrRequest.headers,
                body: urlOrRequest.body,
            };
        } else {
            url = new URL(urlOrRequest)
        }
        const parsedUrl = new URL(url);
        const scheme = parsedUrl.protocol.slice(0, -1);
        const currentContext = context.active();
        const tracer = trace.getTracer('hypertrace-fetch');
        const requestMethod = getRequestMethod(options['method']);
        const attributes = {
            [SemanticAttributes.HTTP_METHOD]: requestMethod,
            [SemanticAttributes.HTTP_SCHEME]: scheme,
            [SemanticAttributes.HTTP_URL]: parsedUrl.toString(),
            [SemanticAttributes.NET_PEER_NAME]: parsedUrl.hostname,
            [SemanticAttributes.NET_PEER_PORT]: parsedUrl.port,
            [SemanticAttributes.HTTP_TARGET]: parsedUrl.pathname,
        };

        let spanOptions = {
            kind: SpanKind.CLIENT,
            attributes: attributes
        }

        span = tracer.startSpan(`${requestMethod} ${parsedUrl.pathname}`, spanOptions, currentContext);

        const headers = optionsToUse.headers || (urlOrRequest instanceof Request ? urlOrRequest.headers : {});
        let reqContentType = ''
        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                let lKey = key.toLowerCase()
                if (lKey === "content-type") {
                    reqContentType = value
                }
                span.setAttribute(`http.request.header.${lKey}`, value);
            });
        } else if (typeof headers === 'object') {
            for (const key in headers) {
                if (headers.hasOwnProperty(key)) {
                    let lKey = key.toLowerCase()
                    if (lKey === "content-type") {
                        reqContentType = headers[key]
                    }
                    span.setAttribute(`http.request.header.${lKey}`, headers[key]);
                }
            }
        }

        let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
            <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
        if (shouldCapture(<boolean>Config.getInstance().config.data_capture!.http_body!.request!, reqContentType)) {
            if (options.body && typeof options.body === 'string') {
                bodyCapture.appendData(options.body)
                span.setAttribute("http.request.body", bodyCapture.dataString())
            }
        }
    } catch (e) {
        if (span) {
            span.end()
        }
        logger.error("Error during request capture phase of fetch instrumentation", e)
        return null
    }
    return span
}

async function recordResponseData(span, response) {
    try {
        let responseBody;
        const clone = response.clone();
        let resContentType
        if (response.headers instanceof Headers) {
            response.headers.forEach((value, key) => {
                let lKey = key.toLowerCase()
                if (lKey === "content-type") {
                    resContentType = value
                }
                span.setAttribute(`http.response.header.${lKey}`, value);
            });
        } else if (typeof response.headers === 'object') {
            for (const key in response.headers) {
                if (response.headers.hasOwnProperty(key)) {
                    let lKey = key.toLowerCase()
                    if (lKey === "content-type") {
                        resContentType = response.headers[key]
                    }
                    span.setAttribute(`http.response.header.${lKey}`, response.headers[key]);
                }
            }
        }

        if (shouldCapture(<boolean>Config.getInstance().config.data_capture!.http_body!.response!, resContentType)) {
            let resBodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
                <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
            let respData = await clone.text()
            resBodyCapture.appendData(respData)
            span.setAttribute("http.response.body", resBodyCapture.dataString())
        }
        span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, response.status)
        span.end()
    } catch (e) {
        span.recordException(e)
        span.end()
    }

}

function getRequestMethod(methodStr) {
    if (!methodStr) {
        return 'GET'
    }
    return methodStr;
}