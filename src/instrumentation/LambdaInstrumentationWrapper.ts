import {SemanticAttributes} from "@opentelemetry/semantic-conventions";
import {logger} from "../Logging";
import {BodyCapture} from "./BodyCapture";
import {Config} from "../config/config";
import {HttpInstrumentationWrapper} from "./HttpInstrumentationWrapper";

export function LambdaRequestHook(span, {event, context}){
    let headers = event['headers']
    let lambdaRequestContext = event['requestContext']
    logger.debug('received lambda event')
    logger.debug(event)

<<<<<<< HEAD
    // event["version"] is not always present
    // the request context will have an `http` field if v2
    if(lambdaRequestContext['http']) {
        let httpContext = lambdaRequestContext['http']
        span.setAttribute(SemanticAttributes.HTTP_METHOD, httpContext['method'])
        span.setAttribute(SemanticAttributes.HTTP_SCHEME, headers['x-forwarded-proto'])
        span.setAttribute(SemanticAttributes.HTTP_TARGET, httpContext['path'])
        span.setAttribute(SemanticAttributes.HTTP_HOST, headers['host'])
    } else {
        span.setAttribute(SemanticAttributes.HTTP_METHOD, event['httpMethod'])
        let proto_header = headers['x-forwarded-proto'] || headers['X-Forwarded-Proto']
        span.setAttribute(SemanticAttributes.HTTP_SCHEME, proto_header)
        span.setAttribute(SemanticAttributes.HTTP_TARGET, event['path'])
        span.setAttribute(SemanticAttributes.HTTP_HOST, lambdaRequestContext['domainName'])
    }



    let cookies = event['cookies']
    if(cookies) {
        span.setAttribute('http.request.header.cookie', cookies.join(';'))
    }

    // req header capture
    if(<boolean>Config.getInstance().config.data_capture!.http_headers!.request!) {
        for (const key in headers) {
            span.setAttribute(`http.request.header.${key}`.toLowerCase(), <string>headers[key])
        }
    }
    // req body capture
    if (shouldCaptureBody(<boolean>Config.getInstance().config.data_capture!.http_body!.request!, headers)) {
        let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
            <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
        bodyCapture.appendData(event['body'])
        span.setAttribute('http.request.body', bodyCapture.dataString())
    }
}

export function LambdaResponseHook(span, {err, res}) : void {
    let statusCode = res['statusCode']
    let responseHeaders = res['headers']
    let responseBody = res['body']
    logger.debug(res)
    if(err){
        logger.error(err)
    }

    if(statusCode){
        span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, statusCode)
    }

    if(responseHeaders && <boolean>Config.getInstance().config.data_capture!.http_headers!.response!) {
        for (const key in responseHeaders) {
            span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>responseHeaders[key])
        }
    }

    if (responseHeaders && shouldCaptureBody(<boolean>Config.getInstance().config.data_capture!.http_body!.response!, responseHeaders)) {
        let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
            <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
        bodyCapture.appendData(responseBody)
        span.setAttribute('http.response.body', bodyCapture.dataString())
    }
}

function shouldCaptureBody(configField: boolean, headers: Map<string, string>): boolean {
    if (!configField) {
        return false
    }
    let contentType = headers['content-type'] || headers['Content-Type']
    if (!contentType) {
        return false
    }
    return HttpInstrumentationWrapper.isRecordableContentType(<string>contentType)
}