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

    constructor(config: AgentConfig) {
        this.agentConfig = config
    }

    incomingRequestHook(span: Span, request: ClientRequest | IncomingMessage) {
        if (request instanceof IncomingMessage) {
            for (const [key, value] of Object.entries(request.headers)) {
                span.setAttribute(`http.request.header.${key}`, <string>value)
            }
            if (this.shouldCaptureBody(request.headers)) {
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
        } else {
            for(const [key, value] of Object.entries(request.getHeaders())) {
                span.setAttribute(`http.request.header.${key}`, <string>value)
            }
        }
    }
    IncomingRequestHook = this.incomingRequestHook.bind(this)

    outgoingRequestHook(request: RequestOptions) : AttrWrapper {
        let attrs = new AttrWrapper()
        let outgoingHeaders = request.headers
        if(!outgoingHeaders){
            return attrs
        }
        for (const [key, value] of Object.entries(outgoingHeaders)) {
            attrs[`http.request.header.${key}`.toLowerCase()] = <string>value
        }
        return attrs
    }
    OutgoingRequestHook = this.outgoingRequestHook.bind(this)


    customAttrs(span: Span, request: ClientRequest | IncomingMessage, response: IncomingMessage | ServerResponse): void {
        let headers = (<ServerResponse>response).getHeaders()
        for (const [key, value] of Object.entries(headers)) {
            span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>value)
        }
        if (this.shouldCaptureBody((<ServerResponse>response).getHeaders())) {

        }
    }
    CustomAttrs = this.customAttrs.bind(this)

    respHook(span: Span, response: IncomingMessage | ServerResponse){
        if(response instanceof IncomingMessage) {
            for (const [key, value] of Object.entries(response.headers)) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>value)
            }
        }
        // const listener = (d: Buffer) => {
        //     console.log("reading data")
        //     console.log(d)
        //     body.push(d);
        // }
        // response!.socket!.on("data", listener)
        // response!.socket!.on('finish', () => {
        //     response!.socket!.removeListener("data", listener)
        //     let parsedBody = Buffer.concat(body).toString();
        //     span.setAttribute("http.response.body", parsedBody)
        // })
    }
    RespHook = this.respHook.bind(this)

    shouldCaptureBody(headers: IncomingHttpHeaders | OutgoingHttpHeaders): boolean {
        if (this.agentConfig.data_capture!.http_body!.request == false) {
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