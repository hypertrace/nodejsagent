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
import {BodyCapture} from "./BodyCapture";
import {Config} from "../config/config";

const _RECORDABLE_CONTENT_TYPES = ['application/json', 'application/graphql', 'application/x-www-form-urlencoded']



export class HttpInstrumentationWrapper {
    private agentConfig: AgentConfig
    private requestHeaderCaptureEnabled: boolean
    private requestBodyCaptureEnabled: boolean
    private responseHeaderCaptureEnabled: boolean
    private responseBodyCaptureEnabled: boolean
    private maxBodySizeBytes : number

    constructor(config: AgentConfig) {
        this.agentConfig = config
        let dataCapture = this.agentConfig!.data_capture
        this.requestHeaderCaptureEnabled = <boolean>dataCapture!.http_headers!.request
        this.responseHeaderCaptureEnabled = <boolean>dataCapture!.http_headers!.response
        this.requestBodyCaptureEnabled = <boolean>dataCapture!.http_body!.request
        this.responseBodyCaptureEnabled = <boolean>dataCapture!.http_body!.response
        this.maxBodySizeBytes = <number>dataCapture!.body_max_size_bytes!
    }

    incomingRequestHook(span: Span, request: ClientRequest | IncomingMessage) {
        if(this.requestHeaderCaptureEnabled) {
            let headers = request instanceof IncomingMessage ? request.headers : request.getHeaders()
            for (const [key, value] of Object.entries(headers)) {
                span.setAttribute(`http.request.header.${key}`, <string>value)
            }
        }
        let headers = request instanceof IncomingMessage ? request.headers : request.getHeaders()
        if (this.shouldCaptureBody(this.requestBodyCaptureEnabled, headers)) {
            let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!)
            const listener = (chunk: any) => {
                bodyCapture.appendData(chunk)
            }
            request.on("data", listener);

            request.once("end", () => {
                request.removeListener('data', listener)
                let bodyString = bodyCapture.dataString()
                span.setAttribute("http.request.body", bodyString)
            });
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
    }
    CustomAttrs = this.customAttrs.bind(this)

    respHook(span: Span, response: IncomingMessage | ServerResponse){
        if(response instanceof IncomingMessage) {
            for (const [key, value] of Object.entries(response.headers)) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>value)
            }
            let bodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes);
            const listener = (chunk : any) => {
                bodyCapture.appendData(chunk);
            };
            response.on("data", listener);
            response.once("end", () => {
                response.removeListener('data', listener);
                let bodyString = bodyCapture.dataString();
                span.setAttribute("http.response.body", bodyString);
            });
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
        return HttpInstrumentationWrapper.isRecordableContentType(<string>contentType)
    }

    public static isRecordableContentType(contentType?: string): boolean {
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