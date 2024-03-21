import {
    ClientRequest,
    IncomingHttpHeaders,
    IncomingMessage,
    OutgoingHttpHeaders,
    RequestOptions,
    ServerResponse
} from "http";
import {context, Span, SpanAttributes} from "@opentelemetry/api";
import {hypertrace} from "../config/generated";
import {AttrWrapper} from "./AttrWrapper";
import {BodyCapture} from "./BodyCapture";
import {Config} from "../config/config";
import {Registry} from "../filter/Registry";
import {filterError, MESSAGE, REQUEST_TYPE, STATUS_CODE} from "../filter/Filter";
import AgentConfig = hypertrace.agent.config.v1.AgentConfig;
import {getRPCMetadata, RPCType} from "@opentelemetry/core";
import {SemanticAttributes} from "@opentelemetry/semantic-conventions";
import {Framework} from "./Framework";
import {hypertraceDomain} from "../HypertraceAgent";
import http from "http";
import stream from "node:stream";

const _RECORDABLE_CONTENT_TYPES = ['application/json', 'application/graphql', 'application/x-www-form-urlencoded']


export class HttpInstrumentationWrapper {
    private agentConfig: AgentConfig
    private requestHeaderCaptureEnabled: boolean
    private requestBodyCaptureEnabled: boolean
    private responseHeaderCaptureEnabled: boolean
    private responseBodyCaptureEnabled: boolean
    private maxBodySizeBytes: number

    constructor(config: AgentConfig) {
        this.agentConfig = config
        let dataCapture = this.agentConfig!.data_capture
        // @ts-ignore
        this.requestHeaderCaptureEnabled = <boolean>dataCapture!.http_headers!.request
        // @ts-ignore
        this.responseHeaderCaptureEnabled = <boolean>dataCapture!.http_headers!.response
        // @ts-ignore
        this.requestBodyCaptureEnabled = <boolean>dataCapture!.http_body!.request
        // @ts-ignore
        this.responseBodyCaptureEnabled = <boolean>dataCapture!.http_body!.response
        // @ts-ignore
        this.maxBodySizeBytes = <number>dataCapture!.body_max_size_bytes!
    }

    incomingRequestHook(span: Span, request: ClientRequest | IncomingMessage) {
        if (this.requestHeaderCaptureEnabled) {
            let headers = request instanceof IncomingMessage ? request.headers : request.getHeaders()
            for (const key in headers) {
                span.setAttribute(`http.request.header.${key}`, <string>headers[key])
            }
        }
        // client outbound
        if (request instanceof ClientRequest) {
            // @ts-ignore
            request.hypertraceSpan = span
        } else { // server inbound
            this.setIncomingRequestAttributes(span, request);

            let headers = request.headers
            // @ts-ignore
            if(request.socket && request.socket.server instanceof http.Server) {
                span.setAttribute("http.scheme", "http")
            } else {
                span.setAttribute("http.scheme", "https")
            }
            let filterResult = Registry.getInstance().applyFilters(span,
                request.url,
                headers,
                undefined,
                REQUEST_TYPE.HTTP
            )
            if (filterResult) {
                if (Framework.getInstance().isPureExpress()) {
                    hypertraceDomain.run(function () {
                        throw filterError()
                    })
                } else {
                        throw filterError()
                    }
                }


            let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
                <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
            if (this.shouldCaptureBody(<boolean>Config.getInstance().config.data_capture!.http_body!.request!, headers)) {
                if (!Framework.getInstance().anyFrameworks() || Framework.getInstance().isExpressBased() || Framework.getInstance().isPureExpress()) {
                    const listener = (chunk: any) => {
                        bodyCapture.appendData(chunk)
                    }
                    request.on("data", listener);


                    request.once("end", () => {
                        hypertraceDomain.run(function () {

                            request.removeListener('data', listener)
                            let bodyString = bodyCapture.dataString()
                            span.setAttribute('http.request.body', bodyString)
                            // @ts-ignore

                            let filterResult = Registry.getInstance().applyFilters(span!,
                                request.url,
                                headers,
                                bodyCapture.processableString(),
                                REQUEST_TYPE.HTTP
                            )
                            if (filterResult) {
                                // we need to use domains to catch an async exception
                                // if the end user app does not have any middlewares reading request body,
                                // applying filters will not have anywhere to propagate the error
                                // so we will see unintended status code / message pair
                                // ex: 200 Forbidden
                                // additionally, if user is using event listeners on request data,
                                // since body read occurs on event emission if our event emitter determines to filter request
                                // user event listeners cannot be prevented from running(or replaced, or mutated) - this will cause
                                // errors since we've already written + closed the response
                                // throwing an uncaught error that is bound within a domain allows us to achieve both:
                                // cancel request without it propagating further through the app &
                                // set the desired response
                                if (Framework.getInstance().isPureExpress()) {
                                    // @ts-ignore
                                    request.res.status(STATUS_CODE)
                                    // @ts-ignore
                                    request.res.end()
                                    // @ts-ignore
                                    if(request.res.setHeader) {
                                        // @ts-ignore
                                        request.res.setHeader = function (name, value) {
                                            return this;
                                        };
                                        // @ts-ignore
                                        request.res.removeHeader = function(name) {
                                            return;
                                        }
                                    }
                                    // @ts-ignore
                                    hypertraceDomain.add(request)
                                    throw filterError()
                                } else {
                                    // @ts-ignore
                                    request.res.statusCode = STATUS_CODE
                                    // @ts-ignore
                                    request.res.statusMessage = MESSAGE
                                    // @ts-ignore
                                    request.next(filterError())
                                }
                            }
                        })
                    });
                }
            }
        }
    }

    IncomingRequestHook = this.incomingRequestHook.bind(this)

    outgoingRequestHook(request: RequestOptions): AttrWrapper {
        let attrs = new AttrWrapper()
        if (this.requestHeaderCaptureEnabled) {
            let outgoingHeaders = request.headers
            if (!outgoingHeaders) {
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
        if (response instanceof ServerResponse && this.responseHeaderCaptureEnabled) {
            let headers = (<ServerResponse>response).getHeaders()
            for (const key in headers) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>headers[key])
            }
        }
    }

    CustomAttrs = this.customAttrs.bind(this)

    respHook(span: Span, response: IncomingMessage | ServerResponse) {
        if (response instanceof IncomingMessage) {
            for (const [key, value] of Object.entries(response.headers)) {
                span.setAttribute(`http.response.header.${key}`.toLowerCase(), <string>value)
            }
            let bodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture.body_max_size_bytes, 0);
            const chunks: Buffer[] = [];
            const originalEmit = response.emit;

            response.emit = function (eventName: string, ...args: any[]) {
                if (eventName === 'data') {
                    chunks.push(Buffer.from(args[0]));
                } else if (eventName === 'end') {
                    const bodyBuffer = Buffer.concat(chunks);
                    let bodyString = bodyBuffer.toString('utf-8');
                    span.setAttribute("http.response.body", bodyString);
                    // @ts-ignore
                    if(response.stream){
                        // @ts-ignore
                        response.stream = stream.Readable.from(bodyBuffer);
                    }

                }

                return originalEmit.apply(response, [eventName, ...args]);
            };

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
        if (contentType === undefined || contentType === null) {
            return false
        }
        for (let recordableType of _RECORDABLE_CONTENT_TYPES) {
            if (contentType.includes(recordableType)) {
                return true
            }
        }
        return false
    }

    // We need to collect request data before sending span to Filter API
    private setIncomingRequestAttributes = (span: Span, request: IncomingMessage) => {
        const {socket} = request;
        const {localAddress, localPort, remoteAddress, remotePort} = socket;
        const rpcMetadata = getRPCMetadata(context.active());

        const attributes: SpanAttributes = {
            [SemanticAttributes.NET_HOST_IP]: localAddress,
            [SemanticAttributes.NET_HOST_PORT]: localPort,
            [SemanticAttributes.NET_PEER_IP]: remoteAddress,
            [SemanticAttributes.NET_PEER_PORT]: remotePort,
        };

        if (rpcMetadata?.type === RPCType.HTTP && rpcMetadata.route !== undefined) {
            attributes[SemanticAttributes.HTTP_ROUTE] = rpcMetadata.route;
        }

        span.setAttributes(attributes);
    };
}