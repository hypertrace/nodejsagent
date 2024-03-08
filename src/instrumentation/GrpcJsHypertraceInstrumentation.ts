/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { EventEmitter } from 'events';

import type {
    Server,
    serialize as Serialize,
    deserialize as Deserialize,
    Client,
    ServiceDefinition,
    loadPackageDefinition,
    GrpcObject, ServiceError,
} from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';

import type * as grpcJs from '@grpc/grpc-js';

import type {
    ServerCallWithMeta,
    SendUnaryDataCallback,
    ServerRegisterFunction,
    HandleCall,
    MakeClientConstructorFunction,
    PackageDefinition,
    GrpcClientFunc,
    ClientRequestFunction,
    metadataCaptureType,
} from '@opentelemetry/instrumentation-grpc/build/src/internal-types';
import type { GrpcInstrumentationConfig } from '@opentelemetry/instrumentation-grpc/build/src/types';

import {
    context,
    propagation,
    ROOT_CONTEXT,
    SpanOptions,
    SpanKind,
    trace,
    Span,
} from '@opentelemetry/api';
import {
    InstrumentationNodeModuleDefinition,
    isWrapped,
    InstrumentationBase,
} from '@opentelemetry/instrumentation';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

import {
    shouldNotTraceServerCall,
    handleServerFunction,
    handleUntracedServerFunction,
} from './GrpcJsHypertraceServerUtils';
import {
    getMethodsToWrap,
    makeGrpcClientRemoteCall,
    extractMetadataOrSpliceDefault,
    setSpanContext,
    patchedCallback,
    patchResponseStreamEvents,
    patchResponseMetadataEvent,
    extractMetadataOrSplice,
} from './GrpcJsHypertraceClientUtils';
import {
    _extractMethodAndService,
    metadataCapture,
    URI_REGEX,
    _methodIsIgnored,
} from '@opentelemetry/instrumentation-grpc/build/src/utils';
import { AttributeValues } from '@opentelemetry/instrumentation-grpc/build/src/enums/AttributeValues';
import { VERSION } from '@opentelemetry/instrumentation-grpc/build/src/version';
import {BodyCapture} from "./BodyCapture";
import {Config} from "../config/config";
import {logger} from "../Logging";
import {REQUEST_TYPE} from "../filter/Filter";
import {Registry} from "../filter/Registry";
import {ServerUnaryCallImpl} from "@grpc/grpc-js/build/src/server-call";

export class GrpcJsHypertraceInstrumentation extends InstrumentationBase {
    private _metadataCapture: metadataCaptureType;

    constructor(config?: GrpcInstrumentationConfig) {
        super('@opentelemetry/instrumentation-grpc', VERSION, config);
        this._metadataCapture = this._createMetadataCapture();
    }

    init() {
        return [
            new InstrumentationNodeModuleDefinition<any>(
                '@grpc/grpc-js',
                ['1.*'],
                (moduleExports, version) => {
                    this._diag.debug(`Applying patch for @grpc/grpc-js@${version}`);
                    if (isWrapped(moduleExports.Server.prototype.register)) {
                        this._unwrap(moduleExports.Server.prototype, 'register');
                    }
                    // Patch Server methods
                    this._wrap(
                        moduleExports.Server.prototype,
                        'register',
                        this._patchServer()
                    );
                    // Patch Client methods
                    if (isWrapped(moduleExports.makeGenericClientConstructor)) {
                        this._unwrap(moduleExports, 'makeGenericClientConstructor');
                    }
                    this._wrap(
                        moduleExports,
                        'makeGenericClientConstructor',
                        this._patchClient(moduleExports)
                    );
                    if (isWrapped(moduleExports.makeClientConstructor)) {
                        this._unwrap(moduleExports, 'makeClientConstructor');
                    }
                    this._wrap(
                        moduleExports,
                        'makeClientConstructor',
                        this._patchClient(moduleExports)
                    );
                    if (isWrapped(moduleExports.loadPackageDefinition)) {
                        this._unwrap(moduleExports, 'loadPackageDefinition');
                    }
                    this._wrap(
                        moduleExports,
                        'loadPackageDefinition',
                        this._patchLoadPackageDefinition(moduleExports)
                    );
                    if (isWrapped(moduleExports.Client.prototype)) {
                        this._unwrap(moduleExports.Client.prototype, 'makeUnaryRequest');
                        this._unwrap(
                            moduleExports.Client.prototype,
                            'makeClientStreamRequest'
                        );
                        this._unwrap(
                            moduleExports.Client.prototype,
                            'makeServerStreamRequest'
                        );
                        this._unwrap(
                            moduleExports.Client.prototype,
                            'makeBidiStreamRequest'
                        );
                    }
                    this._wrap(
                        moduleExports.Client.prototype,
                        'makeUnaryRequest',
                        this._patchClientRequestMethod(moduleExports, false) as any
                    );
                    this._wrap(
                        moduleExports.Client.prototype,
                        'makeClientStreamRequest',
                        this._patchClientRequestMethod(moduleExports, false) as any
                    );
                    this._wrap(
                        moduleExports.Client.prototype,
                        'makeServerStreamRequest',
                        this._patchClientRequestMethod(moduleExports, true) as any
                    );
                    this._wrap(
                        moduleExports.Client.prototype,
                        'makeBidiStreamRequest',
                        this._patchClientRequestMethod(moduleExports, true) as any
                    );
                    return moduleExports;
                },
                (moduleExports, version) => {
                    if (moduleExports === undefined) return;
                    this._diag.debug(`Removing patch for @grpc/grpc-js@${version}`);

                    this._unwrap(moduleExports.Server.prototype, 'register');
                    this._unwrap(moduleExports, 'makeClientConstructor');
                    this._unwrap(moduleExports, 'makeGenericClientConstructor');
                    this._unwrap(moduleExports, 'loadPackageDefinition');
                    this._unwrap(moduleExports.Client.prototype, 'makeUnaryRequest');
                    this._unwrap(
                        moduleExports.Client.prototype,
                        'makeClientStreamRequest'
                    );
                    this._unwrap(
                        moduleExports.Client.prototype,
                        'makeServerStreamRequest'
                    );
                    this._unwrap(moduleExports.Client.prototype, 'makeBidiStreamRequest');
                }
            ),
        ];
    }

    /**
     * @internal
     * Public reference to the protected BaseInstrumentation `_config` instance to be used by this
     * plugin's external helper functions
     */
    getConfig(): GrpcInstrumentationConfig {
        return super.getConfig();
    }

    setConfig(config?: GrpcInstrumentationConfig): void {
        super.setConfig(config);
        this._metadataCapture = this._createMetadataCapture();
    }

    /**
     * Patch for grpc.Server.prototype.register(...) function. Provides auto-instrumentation for
     * client_stream, server_stream, bidi, unary server handler calls.
     */
    private _patchServer(): (
        originalRegister: ServerRegisterFunction
    ) => ServerRegisterFunction {
        const instrumentation = this;
        return (originalRegister: ServerRegisterFunction) => {
            const config = this.getConfig();
            instrumentation._diag.debug('patched gRPC server');
            return function register<RequestType, ResponseType>(
                this: Server,
                name: string,
                handler: HandleCall<unknown, unknown>,
                serialize: Serialize<unknown>,
                deserialize: Deserialize<unknown>,
                type: string
            ): boolean {
                const originalRegisterResult = originalRegister.call(
                    this,
                    name,
                    handler,
                    serialize,
                    deserialize,
                    type
                );
                const handlerSet = this['handlers'].get(name);

                instrumentation._wrap(
                    handlerSet,
                    'func',
                    (originalFunc: HandleCall<unknown, unknown>) => {
                        return function func(
                            this: typeof handlerSet,
                            call: ServerCallWithMeta<RequestType, ResponseType>,
                            callback: SendUnaryDataCallback<unknown>
                        ) {
                            const self = this;

                            if (shouldNotTraceServerCall(name, config.ignoreGrpcMethods)) {
                                return handleUntracedServerFunction(
                                    type,
                                    originalFunc,
                                    call,
                                    callback
                                );
                            }

                            const spanName = `grpc.${name.replace('/', '')}`;
                            const spanOptions: SpanOptions = {
                                kind: SpanKind.SERVER,
                            };

                            instrumentation._diag.debug(
                                `patch func: ${JSON.stringify(spanOptions)}`
                            );

                            context.with(
                                propagation.extract(ROOT_CONTEXT, call.metadata, {
                                    get: (carrier, key) => carrier.get(key).map(String),
                                    keys: carrier => Object.keys(carrier.getMap()),
                                }),
                                () => {
                                    const { service, method } = _extractMethodAndService(name);

                                    const span = instrumentation.tracer
                                        .startSpan(spanName, spanOptions)
                                        .setAttributes({
                                            [SemanticAttributes.RPC_SYSTEM]:
                                            AttributeValues.RPC_SYSTEM,
                                            ["grpc.content_type"]: "application/grpc",
                                            [SemanticAttributes.RPC_METHOD]: method,
                                            [SemanticAttributes.RPC_SERVICE]: service,
                                        });

                                    instrumentation._metadataCapture.server.captureRequestMetadata(
                                        span,
                                        call.metadata
                                    );

                                    // start of diff
                                    addMetadataToSpan(span, call.metadata, 'request')
                                    span.setAttribute("grpc.content_type", "application/grpc")
                                    let bodyCapture = createAndAddBodyCapture(span, (call as ServerUnaryCallImpl<RequestType, ResponseType>).request, 'request')
                                    setPeerData(span, call)
                                    let filterResult = Registry.getInstance().applyFilters(span,
                                        name,
                                        call.metadata.getMap(),
                                        bodyCapture?.processableString(),
                                        REQUEST_TYPE.RPC
                                    )
                                    if (filterResult) {
                                        let errorStatus = {
                                            code: 7,
                                            details: "Forbidden",
                                            metadata: new Metadata()
                                        }
                                        // since we are ending the call here, we need to set span status & end it so it is exported
                                        span.setAttribute('rpc.grpc.status_code', "7")
                                        span.end()
                                        return callback(errorStatus as unknown as ServiceError, undefined)
                                    }
                                    // end of diff

                                    instrumentation._wrap(
                                        call,
                                        'sendMetadata',
                                        originalSendMetadata => (responseMetadata: Metadata) => {
                                            addMetadataToSpan(span, responseMetadata, 'response')
                                            originalSendMetadata.call(call, responseMetadata);
                                        }
                                    );

                                    context.with(trace.setSpan(context.active(), span), () => {
                                        handleServerFunction.call(
                                            self,
                                            span,
                                            type,
                                            originalFunc,
                                            call,
                                            callback
                                        );
                                    });
                                }
                            );
                        };
                    }
                );
                return originalRegisterResult;
            } as typeof Server.prototype.register;
        };
    }

    /**
     * Patch for grpc.Client.make*Request(...) functions.
     * Provides auto-instrumentation for client requests when using a Client without
     * makeGenericClientConstructor/makeClientConstructor
     */
    private _patchClientRequestMethod<ReturnType extends EventEmitter>(
        grpcLib: typeof grpcJs,
        hasResponseStream: boolean
    ): (
        original: ClientRequestFunction<ReturnType>
    ) => ClientRequestFunction<ReturnType> {
        const instrumentation = this;
        return (original: ClientRequestFunction<ReturnType>) => {
            instrumentation._diag.debug(
                'patched makeClientStreamRequest on grpc client'
            );

            return function makeClientStreamRequest(this: grpcJs.Client) {
                // method must always be at first position
                const method = arguments[0];
                const { name, service, methodAttributeValue } =
                    instrumentation._splitMethodString(method);

                // Do not attempt to trace/inject context if method is ignored
                if (
                    method != null &&
                    _methodIsIgnored(
                        methodAttributeValue,
                        instrumentation.getConfig().ignoreGrpcMethods
                    )
                ) {
                    return original.apply(this, [...arguments]);
                }

                const modifiedArgs = [...arguments];
                const metadata = extractMetadataOrSplice(grpcLib, modifiedArgs, 4);

                const span = instrumentation.createClientSpan(
                    name,
                    methodAttributeValue,
                    service,
                    metadata
                );
                instrumentation.extractNetMetadata(this, span);

                // Callback is only present when there is no responseStream
                if (!hasResponseStream) {
                    // Replace the callback with the patched one if it is there.
                    // If the callback arg is not a function on the last position then the client will throw
                    // and never call the callback -> so there's nothing to patch
                    const lastArgIndex = modifiedArgs.length - 1;
                    const callback = modifiedArgs[lastArgIndex];
                    if (typeof callback === 'function') {
                        modifiedArgs[lastArgIndex] = patchedCallback(span, callback);
                    }
                }

                return context.with(trace.setSpan(context.active(), span), () => {
                    setSpanContext(metadata);

                    const call = original.apply(this, [...modifiedArgs]);
                    patchResponseMetadataEvent(
                        span,
                        call,
                        instrumentation._metadataCapture
                    );

                    // Subscribe to response stream events when there's a response stream.
                    if (hasResponseStream) {
                        patchResponseStreamEvents(span, call);
                    }

                    return call;
                });
            };
        };
    }

    /**
     * Entry point for applying client patches to `grpc.makeClientConstructor(...)` equivalents
     * @param this GrpcJsPlugin
     */
    private _patchClient(
        grpcClient: typeof grpcJs
    ): (
        original: MakeClientConstructorFunction
    ) => MakeClientConstructorFunction {
        const instrumentation = this;
        return (original: MakeClientConstructorFunction) => {
            instrumentation._diag.debug('patching client');
            return function makeClientConstructor(
                this: typeof Client,
                methods: ServiceDefinition,
                serviceName: string,
                options?: object
            ) {
                const client = original.call(this, methods, serviceName, options);
                instrumentation._massWrap<typeof client.prototype, string>(
                    client.prototype,
                    getMethodsToWrap.call(instrumentation, client, methods),
                    instrumentation._getPatchedClientMethods(grpcClient)
                );
                return client;
            };
        };
    }

    /**
     * Entry point for client patching for grpc.loadPackageDefinition(...)
     * @param this - GrpcJsPlugin
     */
    private _patchLoadPackageDefinition(grpcClient: typeof grpcJs) {
        const instrumentation = this;
        instrumentation._diag.debug('patching loadPackageDefinition');
        return (original: typeof loadPackageDefinition) => {
            return function patchedLoadPackageDefinition(
                this: null,
                packageDef: PackageDefinition
            ) {
                const result: GrpcObject = original.call(
                    this,
                    packageDef
                ) as GrpcObject;
                instrumentation._patchLoadedPackage(grpcClient, result);
                return result;
            } as typeof loadPackageDefinition;
        };
    }

    /**
     * Parse initial client call properties and start a span to trace its execution
     */
    private _getPatchedClientMethods(
        grpcClient: typeof grpcJs
    ): (original: GrpcClientFunc) => () => EventEmitter {
        const instrumentation = this;
        return (original: GrpcClientFunc) => {
            instrumentation._diag.debug('patch all client methods');
            function clientMethodTrace(this: Client) {
                const name = `grpc.${original.path.replace('/', '')}`;
                const args = [...arguments];
                const metadata = extractMetadataOrSpliceDefault.call(
                    instrumentation,
                    grpcClient,
                    original,
                    args
                );
                const { service, method } = _extractMethodAndService(original.path);

                const span = instrumentation.tracer
                    .startSpan(name, { kind: SpanKind.CLIENT })
                    .setAttributes({
                        [SemanticAttributes.RPC_SYSTEM]: 'grpc',
                        ["grpc.content_type"]: 'application/grpc',
                        [SemanticAttributes.RPC_METHOD]: method,
                        [SemanticAttributes.RPC_SERVICE]: service,
                    });
                instrumentation.extractNetMetadata(this, span);

                instrumentation._metadataCapture.client.captureRequestMetadata(
                    span,
                    metadata
                );
                addMetadataToSpan(span, metadata, "request")
                createAndAddBodyCapture(span, args[0], 'request')
                return context.with(trace.setSpan(context.active(), span), () =>
                    makeGrpcClientRemoteCall(
                        instrumentation._metadataCapture,
                        original,
                        args,
                        metadata,
                        this
                    )(span)
                );
            }
            Object.assign(clientMethodTrace, original);
            return clientMethodTrace;
        };
    }

    private _splitMethodString(method: string) {
        if (method == null) {
            return { name: '', service: '', methodAttributeValue: '' };
        }
        const name = `grpc.${method.replace('/', '')}`;
        const { service, method: methodAttributeValue } =
            _extractMethodAndService(method);
        return { name, service, methodAttributeValue };
    }

    private createClientSpan(
        name: string,
        methodAttributeValue: string,
        service: string,
        metadata?: grpcJs.Metadata
    ) {
        const span = this.tracer
            .startSpan(name, { kind: SpanKind.CLIENT })
            .setAttributes({
                [SemanticAttributes.RPC_SYSTEM]: 'grpc',
                [SemanticAttributes.RPC_METHOD]: methodAttributeValue,
                [SemanticAttributes.RPC_SERVICE]: service,
            });

        if (metadata != null) {
            this._metadataCapture.client.captureRequestMetadata(span, metadata);
        }
        return span;
    }

    private extractNetMetadata(client: grpcJs.Client, span: Span) {
        // set net.peer.* from target (e.g., "dns:otel-productcatalogservice:8080") as a hint to APMs
        const parsedUri = URI_REGEX.exec(client.getChannel().getTarget());
        if (parsedUri != null && parsedUri.groups != null) {
            span.setAttribute(
                SemanticAttributes.NET_PEER_NAME,
                parsedUri.groups['name']
            );
            span.setAttribute(
                SemanticAttributes.NET_PEER_PORT,
                parseInt(parsedUri.groups['port'])
            );
        }
    }

    /**
     * Utility function to patch *all* functions loaded through a proto file.
     * Recursively searches for Client classes and patches all methods, reversing the
     * parsing done by grpc.loadPackageDefinition
     * https://github.com/grpc/grpc-node/blob/1d14203c382509c3f36132bd0244c99792cb6601/packages/grpc-js/src/make-client.ts#L200-L217
     */
    private _patchLoadedPackage(
        grpcClient: typeof grpcJs,
        result: GrpcObject
    ): void {
        Object.values(result).forEach(service => {
            if (typeof service === 'function') {
                this._massWrap<typeof service.prototype, string>(
                    service.prototype,
                    getMethodsToWrap.call(this, service, service.service),
                    this._getPatchedClientMethods.call(this, grpcClient)
                );
            } else if (typeof service.format !== 'string') {
                // GrpcObject
                this._patchLoadedPackage.call(this, grpcClient, service as GrpcObject);
            }
        });
    }

    private _createMetadataCapture(): metadataCaptureType {
        const config = this.getConfig();

        return {
            client: {
                captureRequestMetadata: metadataCapture(
                    'request',
                    config.metadataToSpanAttributes?.client?.requestMetadata ?? []
                ),
                captureResponseMetadata: metadataCapture(
                    'response',
                    config.metadataToSpanAttributes?.client?.responseMetadata ?? []
                ),
            },
            server: {
                captureRequestMetadata: metadataCapture(
                    'request',
                    config.metadataToSpanAttributes?.server?.requestMetadata ?? []
                ),
                captureResponseMetadata: metadataCapture(
                    'response',
                    config.metadataToSpanAttributes?.server?.responseMetadata ?? []
                ),
            },
        };
    }
}

// /*
//  * Copyright The OpenTelemetry Authors
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      https://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
//
// import type { EventEmitter } from 'events';
//
// import type {
//     Server,
//     serialize as Serialize,
//     deserialize as Deserialize,
//     Client,
//     ServiceDefinition,
//     loadPackageDefinition,
//     GrpcObject,
// } from '@grpc/grpc-js';
//
// import { Metadata } from '@grpc/grpc-js';
//
// import type * as grpcJs from '@grpc/grpc-js';
//
// import type {
//     ServerCallWithMeta,
//     SendUnaryDataCallback,
//     ServerRegisterFunction,
//     HandleCall,
//     MakeClientConstructorFunction,
//     PackageDefinition,
//     GrpcClientFunc,
//     ClientRequestFunction,
//     metadataCaptureType,
// } from '@opentelemetry/instrumentation-grpc/build/src/internal-types';
// import type { GrpcInstrumentationConfig } from '@opentelemetry/instrumentation-grpc/build/src/types';
//
// import {
//     context,
//     propagation,
//     ROOT_CONTEXT,
//     SpanOptions,
//     SpanKind,
//     trace,
//     Span,
// } from '@opentelemetry/api';
// import {
//     InstrumentationNodeModuleDefinition,
//     isWrapped,
//     InstrumentationBase,
// } from '@opentelemetry/instrumentation';
// import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
//
// import {
//     shouldNotTraceServerCall,
//     handleServerFunction,
//     handleUntracedServerFunction,
// } from '@opentelemetry/instrumentation-grpc/build/src/serverUtils';
// import {
//     getMethodsToWrap,
//     extractMetadataOrSpliceDefault,
//     makeGrpcClientRemoteCall,
//     setSpanContext,
//     patchedCallback,
//     patchResponseStreamEvents,
//     patchResponseMetadataEvent,
//     extractMetadataOrSplice,
// } from '@opentelemetry/instrumentation-grpc/build/src/clientUtils';
// import {
//     _extractMethodAndService,
//     metadataCapture,
//     URI_REGEX,
//     _methodIsIgnored,
// } from '@opentelemetry/instrumentation-grpc/build/src/utils';
// import { AttributeValues } from '@opentelemetry/instrumentation-grpc/build/src/enums/AttributeValues';
// import { VERSION } from '@opentelemetry/instrumentation-grpc/build/src/version';
// import {ServerUnaryCallImpl} from "@grpc/grpc-js/build/src/server-call";
// import {Registry} from "../filter/Registry";
// import {REQUEST_TYPE} from "../filter/Filter";
// import {ServiceError} from "@grpc/grpc-js";
// import {BodyCapture} from "./BodyCapture";
// import {Config} from "../config/config";
// import {logger} from "../Logging";
// // import {makeGrpcClientRemoteCall} from "./GrpcJsHypertraceClientUtils";
//
// export class GrpcJsHypertraceInstrumentation extends InstrumentationBase {
//     private _metadataCapture: metadataCaptureType;
//
//     constructor(config?: GrpcInstrumentationConfig) {
//         super('@opentelemetry/instrumentation-grpc', VERSION, config);
//         this._metadataCapture = this._createMetadataCapture();
//     }
//
//     init() {
//         return [
//             new InstrumentationNodeModuleDefinition<any>(
//                 '@grpc/grpc-js',
//                 ['1.*'],
//                 (moduleExports, version) => {
//                     this._diag.debug(`Applying patch for @grpc/grpc-js@${version}`);
//                     if (isWrapped(moduleExports.Server.prototype.register)) {
//                         this._unwrap(moduleExports.Server.prototype, 'register');
//                     }
//                     // Patch Server methods
//                     this._wrap(
//                         moduleExports.Server.prototype,
//                         'register',
//                         this._patchServer()
//                     );
//                     // Patch Client methods
//                     if (isWrapped(moduleExports.makeGenericClientConstructor)) {
//                         this._unwrap(moduleExports, 'makeGenericClientConstructor');
//                     }
//                     this._wrap(
//                         moduleExports,
//                         'makeGenericClientConstructor',
//                         this._patchClient(moduleExports)
//                     );
//                     if (isWrapped(moduleExports.makeClientConstructor)) {
//                         this._unwrap(moduleExports, 'makeClientConstructor');
//                     }
//                     this._wrap(
//                         moduleExports,
//                         'makeClientConstructor',
//                         this._patchClient(moduleExports)
//                     );
//                     if (isWrapped(moduleExports.loadPackageDefinition)) {
//                         this._unwrap(moduleExports, 'loadPackageDefinition');
//                     }
//                     this._wrap(
//                         moduleExports,
//                         'loadPackageDefinition',
//                         this._patchLoadPackageDefinition(moduleExports)
//                     );
//                     if (isWrapped(moduleExports.Client.prototype)) {
//                         this._unwrap(moduleExports.Client.prototype, 'makeUnaryRequest');
//                         this._unwrap(
//                             moduleExports.Client.prototype,
//                             'makeClientStreamRequest'
//                         );
//                         this._unwrap(
//                             moduleExports.Client.prototype,
//                             'makeServerStreamRequest'
//                         );
//                         this._unwrap(
//                             moduleExports.Client.prototype,
//                             'makeBidiStreamRequest'
//                         );
//                     }
//                     this._wrap(
//                         moduleExports.Client.prototype,
//                         'makeUnaryRequest',
//                         this._patchClientRequestMethod(moduleExports, false) as any
//                     );
//                     this._wrap(
//                         moduleExports.Client.prototype,
//                         'makeClientStreamRequest',
//                         this._patchClientRequestMethod(moduleExports, false) as any
//                     );
//                     this._wrap(
//                         moduleExports.Client.prototype,
//                         'makeServerStreamRequest',
//                         this._patchClientRequestMethod(moduleExports, true) as any
//                     );
//                     this._wrap(
//                         moduleExports.Client.prototype,
//                         'makeBidiStreamRequest',
//                         this._patchClientRequestMethod(moduleExports, true) as any
//                     );
//                     return moduleExports;
//                 },
//                 (moduleExports, version) => {
//                     if (moduleExports === undefined) return;
//                     this._diag.debug(`Removing patch for @grpc/grpc-js@${version}`);
//
//                     this._unwrap(moduleExports.Server.prototype, 'register');
//                     this._unwrap(moduleExports, 'makeClientConstructor');
//                     this._unwrap(moduleExports, 'makeGenericClientConstructor');
//                     this._unwrap(moduleExports, 'loadPackageDefinition');
//                     this._unwrap(moduleExports.Client.prototype, 'makeUnaryRequest');
//                     this._unwrap(
//                         moduleExports.Client.prototype,
//                         'makeClientStreamRequest'
//                     );
//                     this._unwrap(
//                         moduleExports.Client.prototype,
//                         'makeServerStreamRequest'
//                     );
//                     this._unwrap(moduleExports.Client.prototype, 'makeBidiStreamRequest');
//                 }
//             ),
//         ];
//     }
//
//     /**
//      * @internal
//      * Public reference to the protected BaseInstrumentation `_config` instance to be used by this
//      * plugin's external helper functions
//      */
//     getConfig(): GrpcInstrumentationConfig {
//         return super.getConfig();
//     }
//
//     setConfig(config?: GrpcInstrumentationConfig): void {
//         super.setConfig(config);
//         this._metadataCapture = this._createMetadataCapture();
//     }
//
//     /**
//      * Patch for grpc.Server.prototype.register(...) function. Provides auto-instrumentation for
//      * client_stream, server_stream, bidi, unary server handler calls.
//      */
//     private _patchServer(): (
//         originalRegister: ServerRegisterFunction
//     ) => ServerRegisterFunction {
//         const instrumentation = this;
//         return (originalRegister: ServerRegisterFunction) => {
//             const config = this.getConfig();
//             instrumentation._diag.debug('patched gRPC server');
//             return function register<RequestType, ResponseType>(
//                 this: Server,
//                 name: string,
//                 handler: HandleCall<unknown, unknown>,
//                 serialize: Serialize<unknown>,
//                 deserialize: Deserialize<unknown>,
//                 type: string
//             ): boolean {
//                 const originalRegisterResult = originalRegister.call(
//                     this,
//                     name,
//                     handler,
//                     serialize,
//                     deserialize,
//                     type
//                 );
//                 const handlerSet = this['handlers'].get(name);
//
//                 instrumentation._wrap(
//                     handlerSet,
//                     'func',
//                     (originalFunc: HandleCall<unknown, unknown>) => {
//                         return function func(
//                             this: typeof handlerSet,
//                             call: ServerCallWithMeta<RequestType, ResponseType>,
//                             callback: SendUnaryDataCallback<unknown>
//                         ) {
//                             const self = this;
//
//                             if (shouldNotTraceServerCall(name, config.ignoreGrpcMethods)) {
//                                 return handleUntracedServerFunction(
//                                     type,
//                                     originalFunc,
//                                     call,
//                                     callback
//                                 );
//                             }
//
//                             const spanName = `grpc.${name.replace('/', '')}`;
//                             const spanOptions: SpanOptions = {
//                                 kind: SpanKind.SERVER,
//                             };
//
//                             instrumentation._diag.debug(
//                                 `patch func: ${JSON.stringify(spanOptions)}`
//                             );
//
//                             context.with(
//                                 propagation.extract(ROOT_CONTEXT, call.metadata, {
//                                     get: (carrier, key) => carrier.get(key).map(String),
//                                     keys: carrier => Object.keys(carrier.getMap()),
//                                 }),
//                                 () => {
//                                     const { service, method } = _extractMethodAndService(name);
//
//                                     const span = instrumentation.tracer
//                                         .startSpan(spanName, spanOptions)
//                                         .setAttributes({
//                                             [SemanticAttributes.RPC_SYSTEM]:
//                                             AttributeValues.RPC_SYSTEM,
//                                             [SemanticAttributes.RPC_METHOD]: method,
//                                             [SemanticAttributes.RPC_SERVICE]: service,
//                                         });
//
//                                     instrumentation._metadataCapture.server.captureRequestMetadata(
//                                         span,
//                                         call.metadata
//                                     );
//
//                                     // start of diff
//                                     addMetadataToSpan(span, call.metadata, 'request')
//                                     span.setAttribute("grpc.content_type", "application/grpc")
//                                     let bodyCapture = createAndAddBodyCapture(span, (call as ServerUnaryCallImpl<RequestType, ResponseType>).request, 'request')
//                                     setPeerData(span, call)
//                                     let filterResult = Registry.getInstance().applyFilters(span,
//                                         name,
//                                         call.metadata.getMap(),
//                                         bodyCapture?.processableString(),
//                                         REQUEST_TYPE.RPC
//                                     )
//                                     if (filterResult) {
//                                         let errorStatus = {
//                                             code: 7,
//                                             details: "Forbidden",
//                                             metadata: new Metadata()
//                                         }
//                                         // since we are ending the call here, we need to set span status & end it so it is exported
//                                         span.setAttribute('rpc.grpc.status_code', "7")
//                                         span.end()
//                                         return callback(errorStatus as unknown as ServiceError, undefined)
//                                     }
//                                     // end of diff
//
//                                     instrumentation._wrap(
//                                         call,
//                                         'sendMetadata',
//                                         originalSendMetadata => (responseMetadata: Metadata) => {
//                                             let span = trace.getSpan(context.active())
//                                             if (span) {
//                                                 addMetadataToSpan(span, responseMetadata, 'response')
//                                             }
//                                             originalSendMetadata.call(call, responseMetadata);
//                                         }
//                                     );
//
//                                     context.with(trace.setSpan(context.active(), span), () => {
//                                         handleServerFunction.call(
//                                             self,
//                                             span,
//                                             type,
//                                             originalFunc,
//                                             call,
//                                             callback
//                                         );
//                                     });
//                                 }
//                             );
//                         };
//                     }
//                 );
//                 return originalRegisterResult;
//             } as typeof Server.prototype.register;
//         };
//     }
//
//     /**
//      * Patch for grpc.Client.make*Request(...) functions.
//      * Provides auto-instrumentation for client requests when using a Client without
//      * makeGenericClientConstructor/makeClientConstructor
//      */
//     private _patchClientRequestMethod<ReturnType extends EventEmitter>(
//         grpcLib: typeof grpcJs,
//         hasResponseStream: boolean
//     ): (
//         original: ClientRequestFunction<ReturnType>
//     ) => ClientRequestFunction<ReturnType> {
//         const instrumentation = this;
//         return (original: ClientRequestFunction<ReturnType>) => {
//             instrumentation._diag.debug(
//                 'patched makeClientStreamRequest on grpc client'
//             );
//
//             return function makeClientStreamRequest(this: grpcJs.Client) {
//                 // method must always be at first position
//                 const method = arguments[0];
//                 const { name, service, methodAttributeValue } =
//                     instrumentation._splitMethodString(method);
//
//                 // Do not attempt to trace/inject context if method is ignored
//                 if (
//                     method != null &&
//                     _methodIsIgnored(
//                         methodAttributeValue,
//                         instrumentation.getConfig().ignoreGrpcMethods
//                     )
//                 ) {
//                     return original.apply(this, [...arguments]);
//                 }
//
//                 const modifiedArgs = [...arguments];
//                 const metadata = extractMetadataOrSplice(grpcLib, modifiedArgs, 4);
//
//                 const span = instrumentation.createClientSpan(
//                     name,
//                     methodAttributeValue,
//                     service,
//                     metadata
//                 );
//                 instrumentation.extractNetMetadata(this, span);
//
//                 // Callback is only present when there is no responseStream
//                 if (!hasResponseStream) {
//                     // Replace the callback with the patched one if it is there.
//                     // If the callback arg is not a function on the last position then the client will throw
//                     // and never call the callback -> so there's nothing to patch
//                     const lastArgIndex = modifiedArgs.length - 1;
//                     const callback = modifiedArgs[lastArgIndex];
//                     if (typeof callback === 'function') {
//                         modifiedArgs[lastArgIndex] = patchedCallback(span, callback);
//                     }
//                 }
//
//                 return context.with(trace.setSpan(context.active(), span), () => {
//                     setSpanContext(metadata);
//
//                     const call = original.apply(this, [...modifiedArgs]);
//                     patchResponseMetadataEvent(
//                         span,
//                         call,
//                         instrumentation._metadataCapture
//                     );
//
//                     // Subscribe to response stream events when there's a response stream.
//                     if (hasResponseStream) {
//                         patchResponseStreamEvents(span, call);
//                     }
//
//                     return call;
//                 });
//             };
//         };
//     }
//
//     /**
//      * Entry point for applying client patches to `grpc.makeClientConstructor(...)` equivalents
//      * @param this GrpcJsPlugin
//      */
//     private _patchClient(
//         grpcClient: typeof grpcJs
//     ): (
//         original: MakeClientConstructorFunction
//     ) => MakeClientConstructorFunction {
//         const instrumentation = this;
//         return (original: MakeClientConstructorFunction) => {
//             instrumentation._diag.debug('patching client');
//             return function makeClientConstructor(
//                 this: typeof Client,
//                 methods: ServiceDefinition,
//                 serviceName: string,
//                 options?: object
//             ) {
//                 const client = original.call(this, methods, serviceName, options);
//                 instrumentation._massWrap<typeof client.prototype, string>(
//                     client.prototype,
//                     getMethodsToWrap.call(instrumentation, client, methods),
//                     instrumentation._getPatchedClientMethods(grpcClient)
//                 );
//                 return client;
//             };
//         };
//     }
//
//     /**
//      * Entry point for client patching for grpc.loadPackageDefinition(...)
//      * @param this - GrpcJsPlugin
//      */
//     private _patchLoadPackageDefinition(grpcClient: typeof grpcJs) {
//         const instrumentation = this;
//         instrumentation._diag.debug('patching loadPackageDefinition');
//         return (original: typeof loadPackageDefinition) => {
//             return function patchedLoadPackageDefinition(
//                 this: null,
//                 packageDef: PackageDefinition
//             ) {
//                 const result: GrpcObject = original.call(
//                     this,
//                     packageDef
//                 ) as GrpcObject;
//                 instrumentation._patchLoadedPackage(grpcClient, result);
//                 return result;
//             } as typeof loadPackageDefinition;
//         };
//     }
//
//     /**
//      * Parse initial client call properties and start a span to trace its execution
//      */
//     private _getPatchedClientMethods(
//         grpcClient: typeof grpcJs
//     ): (original: GrpcClientFunc) => () => EventEmitter {
//         const instrumentation = this;
//         return (original: GrpcClientFunc) => {
//             instrumentation._diag.debug('patch all client methods');
//             function clientMethodTrace(this: Client) {
//                 const name = `grpc.${original.path.replace('/', '')}`;
//                 const args = [...arguments];
//                 const metadata = extractMetadataOrSpliceDefault.call(
//                     instrumentation,
//                     grpcClient,
//                     original,
//                     args
//                 );
//                 const { service, method } = _extractMethodAndService(original.path);
//
//                 const span = instrumentation.tracer
//                     .startSpan(name, { kind: SpanKind.CLIENT })
//                     .setAttributes({
//                         [SemanticAttributes.RPC_SYSTEM]: 'grpc',
//                         [SemanticAttributes.RPC_METHOD]: method,
//                         [SemanticAttributes.RPC_SERVICE]: service,
//                     });
//                 instrumentation.extractNetMetadata(this, span);
//
//                 instrumentation._metadataCapture.client.captureRequestMetadata(
//                     span,
//                     metadata
//                 );
//                 addMetadataToSpan(span, metadata, "request")
//
//                 return context.with(trace.setSpan(context.active(), span), () =>
//                     makeGrpcClientRemoteCall(
//                         instrumentation._metadataCapture,
//                         original,
//                         args,
//                         metadata,
//                         this
//                     )(span)
//                 );
//             }
//             Object.assign(clientMethodTrace, original);
//             return clientMethodTrace;
//         };
//     }
//
//     private _splitMethodString(method: string) {
//         if (method == null) {
//             return { name: '', service: '', methodAttributeValue: '' };
//         }
//         const name = `grpc.${method.replace('/', '')}`;
//         const { service, method: methodAttributeValue } =
//             _extractMethodAndService(method);
//         return { name, service, methodAttributeValue };
//     }
//
//     private createClientSpan(
//         name: string,
//         methodAttributeValue: string,
//         service: string,
//         metadata?: grpcJs.Metadata
//     ) {
//         const span = this.tracer
//             .startSpan(name, { kind: SpanKind.CLIENT })
//             .setAttributes({
//                 [SemanticAttributes.RPC_SYSTEM]: 'grpc',
//                 [SemanticAttributes.RPC_METHOD]: methodAttributeValue,
//                 [SemanticAttributes.RPC_SERVICE]: service,
//             });
//
//         if (metadata != null) {
//             this._metadataCapture.client.captureRequestMetadata(span, metadata);
//         }
//         return span;
//     }
//
//     private extractNetMetadata(client: grpcJs.Client, span: Span) {
//         // set net.peer.* from target (e.g., "dns:otel-productcatalogservice:8080") as a hint to APMs
//         const parsedUri = URI_REGEX.exec(client.getChannel().getTarget());
//         if (parsedUri != null && parsedUri.groups != null) {
//             span.setAttribute(
//                 SemanticAttributes.NET_PEER_NAME,
//                 parsedUri.groups['name']
//             );
//             span.setAttribute(
//                 SemanticAttributes.NET_PEER_PORT,
//                 parseInt(parsedUri.groups['port'])
//             );
//         }
//     }
//
//     /**
//      * Utility function to patch *all* functions loaded through a proto file.
//      * Recursively searches for Client classes and patches all methods, reversing the
//      * parsing done by grpc.loadPackageDefinition
//      * https://github.com/grpc/grpc-node/blob/1d14203c382509c3f36132bd0244c99792cb6601/packages/grpc-js/src/make-client.ts#L200-L217
//      */
//     private _patchLoadedPackage(
//         grpcClient: typeof grpcJs,
//         result: GrpcObject
//     ): void {
//         Object.values(result).forEach(service => {
//             if (typeof service === 'function') {
//                 this._massWrap<typeof service.prototype, string>(
//                     service.prototype,
//                     getMethodsToWrap.call(this, service, service.service),
//                     this._getPatchedClientMethods.call(this, grpcClient)
//                 );
//             } else if (typeof service.format !== 'string') {
//                 // GrpcObject
//                 this._patchLoadedPackage.call(this, grpcClient, service as GrpcObject);
//             }
//         });
//     }
//
//     private _createMetadataCapture(): metadataCaptureType {
//         const config = this.getConfig();
//
//         return {
//             client: {
//                 captureRequestMetadata: metadataCapture(
//                     'request',
//                     config.metadataToSpanAttributes?.client?.requestMetadata ?? []
//                 ),
//                 captureResponseMetadata: metadataCapture(
//                     'response',
//                     config.metadataToSpanAttributes?.client?.responseMetadata ?? []
//                 ),
//             },
//             server: {
//                 captureRequestMetadata: metadataCapture(
//                     'request',
//                     config.metadataToSpanAttributes?.server?.requestMetadata ?? []
//                 ),
//                 captureResponseMetadata: metadataCapture(
//                     'response',
//                     config.metadataToSpanAttributes?.server?.responseMetadata ?? []
//                 ),
//             },
//         };
//     }
// }
//
export function addMetadataToSpan(span, metadata, type) {
    try {
        let keyPrefix = `rpc.${type}.metadata`
        for (let entry of Object.keys(metadata.getMap())) {
            span.setAttribute(`${keyPrefix}.${entry}`, metadata.get(entry).toString())
        }
    } catch (e) {
        logger.error('error adding grpc metadata data to span')
        logger.error(e)
    }
}

function setPeerData(span, call) {
    let socket = call.call.stream.session.socket
    if(!socket){
        return
    }

    const remoteAddress = socket.remoteAddress
    const remotePort = socket.remotePort
    if (remoteAddress) {
        span.setAttribute("net.peer.ip", remoteAddress)
    }
    if (remotePort) {
        span.setAttribute("net.peer.port", remotePort)
    }

}


export function createAndAddBodyCapture(span, bodyObject, type) {
    try {
        let key = `rpc.${type}.body`
        let bodyCapture: BodyCapture = new BodyCapture(<number>Config.getInstance().config.data_capture!.body_max_size_bytes!,
            <number>Config.getInstance().config.data_capture!.body_max_processing_size_bytes!)
        bodyCapture.appendData(JSON.stringify(bodyObject))
        span.setAttribute(key, bodyCapture.dataString())
        return bodyCapture
    } catch (e) {
        logger.error('error adding grpc body data to span')
        logger.error(e)
    }
}