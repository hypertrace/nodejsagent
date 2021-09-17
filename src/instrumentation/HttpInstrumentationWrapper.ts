import {
    ClientRequest,
    IncomingHttpHeaders,
    IncomingMessage,
    OutgoingHttpHeaders, RequestOptions,
    ServerResponse
} from "http";
import {Span} from "@opentelemetry/api";
import {hypertrace} from "../config/generated";
import AgentConfig = hypertrace.agent.config.v1.AgentConfig;
import {AttrWrapper} from "./AttrWrapper";

const _RECORDABLE_CONTENT_TYPES = ['application/json', 'application/graphql', 'application/x-www-form-urlencoded']



export class HttpInstrumentationWrapper {
    private agentConfig: AgentConfig
    private requestHeaderCaptureEnabled: boolean
    private requestBodyCaptureEnabled: boolean
    private responseHeaderCaptureEnabled: boolean
    private responseBodyCaptureEnabled: boolean

    constructor(config: AgentConfig) {
        this.agentConfig = config
        let dataCapture = this.agentConfig!.data_capture
        this.requestHeaderCaptureEnabled = <boolean>dataCapture!.http_headers!.request
        this.responseHeaderCaptureEnabled = <boolean>dataCapture!.http_headers!.response
        this.requestBodyCaptureEnabled = <boolean>dataCapture!.http_body!.request
        this.responseBodyCaptureEnabled = <boolean>dataCapture!.http_body!.response
    }

    incomingRequestHook(span: Span, request: ClientRequest | IncomingMessage) {
        if(this.requestHeaderCaptureEnabled) {
            let headers = request instanceof IncomingMessage ? request.headers : request.getHeaders()
            for (const [key, value] of Object.entries(headers)) {
                span.setAttribute(`http.request.header.${key}`, <string>value)
            }
        }

        if (request instanceof IncomingMessage) {
            if (this.shouldCaptureBody(this.requestBodyCaptureEnabled, request.headers)) {
                let body: any[] = []
                const listener = (chunk: any) => {
                    body.push(chunk)
                }
                request.on("data", listener);

                request.once("end", () => {
                    request.removeListener('data', listener)
                    let parsedBody = Buffer.concat(body).toString();
                    span.setAttribute("http.request.body", parsedBody)
                });
            }
        }
    }
    IncomingRequestHook = this.incomingRequestHook.bind(this)

    outgoingRequestHook(request: RequestOptions) : AttrWrapper {
        let attrs = new AttrWrapper()
        if(this.requestHeaderCaptureEnabled) {
            let outgoingHeaders = request.headers
            if(!outgoingHeaders){
                return attrs
            }
            for (const [key, value] of Object.entries(outgoingHeaders)) {
                attrs[`http.request.header.${key}`.toLowerCase()] = <string>value
            }
        }
        return attrs
    }
    OutgoingRequestHook = this.outgoingRequestHook.bind(this)


    customAttrs(span: Span, request: ClientRequest | IncomingMessage, response: IncomingMessage | ServerResponse): void {
        if(this.responseHeaderCaptureEnabled) {
            let headers = (<ServerResponse>response).getHeaders()
            for (const [key, value] of Object.entries(headers)) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>value)
            }
        }
        if (this.shouldCaptureBody(this.responseBodyCaptureEnabled, (<ServerResponse>response).getHeaders())) {
            let body: any[] = []
            const listener = (chunk: any) => {
                body.push(chunk)
            }

            response.on("data", listener);

            response.once("end", () => {
                request.removeListener('data', listener)
                let parsedBody = Buffer.concat(body).toString();
                span.setAttribute("http.response.body", parsedBody)
            });
        }
    }
    CustomAttrs = this.customAttrs.bind(this)

    respHook(span: Span, response: IncomingMessage | ServerResponse){
        if(response instanceof IncomingMessage) {
            for (const [key, value] of Object.entries(response.headers)) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>value)
            }
        }
    }
    RespHook = this.respHook.bind(this)

    private shouldCaptureBody(configField: boolean, headers: IncomingHttpHeaders | OutgoingHttpHeaders): boolean {
        if (!configField) {
            return false
        }
        let contentType = headers['content-type']
        if (!contentType) {
            return false
        }
        return this.recordableContentType(<string>contentType)
    }

    private recordableContentType(contentType?: string): boolean {
        if (contentType === undefined) {
            return false
        }
        for (let recordableType of _RECORDABLE_CONTENT_TYPES) {
            if (contentType.includes(recordableType)) {
                return true
            }
        }
        return false
    }
}