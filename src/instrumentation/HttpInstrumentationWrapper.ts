import {
    ClientRequest,
    IncomingHttpHeaders,
    IncomingMessage,
    OutgoingHttpHeaders,
    RequestOptions,
    ServerResponse
} from "http";
import {Span} from "@opentelemetry/api";
import {hypertrace} from "../config/generated";
import {AttrWrapper} from "./AttrWrapper";
import {BodyCapture} from "./BodyCapture";
import {Config} from "../config/config";
import {Registry} from "../filter/Registry";
import {filterError, MESSAGE, REQUEST_TYPE, STATUS_CODE} from "../filter/Filter";
import AgentConfig = hypertrace.agent.config.v1.AgentConfig;

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
            for (const key in headers) {
                span.setAttribute(`http.request.header.${key}`, <string>headers[key])
            }
        }
        // client outbound
        if(request instanceof ClientRequest) {
            // @ts-ignore
            request.hypertraceSpan = span
        } else { // server inbound
            let headers = request.headers
            let filterResult = Registry.getInstance().applyFilters(span,
                request.url,
                headers,
                undefined,
                REQUEST_TYPE.HTTP
            )
            if(filterResult){
               throw filterError()
            }
            let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!)
            if (this.shouldCaptureBody(this.requestBodyCaptureEnabled, headers)) {
                const listener = (chunk: any) => {
                    bodyCapture.appendData(chunk)
                }
                request.on("data", listener);

                request.once("end", () => {
                    request.removeListener('data', listener)
                    let bodyString = bodyCapture.dataString()
                    // @ts-ignore
                    if(request.res){ // this means we are in a express based app
                        let filterResult = Registry.getInstance().applyFilters(span,
                            request.url,
                            headers,
                            bodyString,
                            REQUEST_TYPE.HTTP
                        )
                        if(filterResult){
                            // @ts-ignore
                            request.res.statusCode = STATUS_CODE
                            // @ts-ignore
                            request.res.statusMessage = MESSAGE
                            // @ts-ignore
                            request.res.req.next(filterError())

                            // @ts-ignore
                            //request.res.socket.destroy()
                        }
                    }
                    span.setAttribute("http.request.body", bodyString)
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
            for (const key in outgoingHeaders) {
                attrs[`http.request.header.${key}`.toLowerCase()] = outgoingHeaders[key]
            }
        }
        return attrs
    }
    OutgoingRequestHook = this.outgoingRequestHook.bind(this)


    customAttrs(span: Span, request: ClientRequest | IncomingMessage, response: IncomingMessage | ServerResponse): void {
        if(response instanceof ServerResponse && this.responseHeaderCaptureEnabled) {
            let headers = (<ServerResponse>response).getHeaders()
            for(const key in headers) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>headers[key])
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