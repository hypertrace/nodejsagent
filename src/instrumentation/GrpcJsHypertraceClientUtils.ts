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

import { GrpcJsInstrumentation } from '@opentelemetry/instrumentation-grpc/build/src/grpc-js/index';
import type { GrpcClientFunc, SendUnaryDataCallback } from '@opentelemetry/instrumentation-grpc/build/src/grpc-js/types';
import {
    SpanKind,
    Span,
    SpanStatusCode,
    SpanStatus,
    propagation,
    context,
} from '@opentelemetry/api';
import type * as grpcJs from '@grpc/grpc-js';
import {
    _grpcStatusCodeToSpanStatus,
    _grpcStatusCodeToOpenTelemetryStatusCode,
    _methodIsIgnored,
} from '@opentelemetry/instrumentation-grpc/build/src/utils';
import { CALL_SPAN_ENDED } from '@opentelemetry/instrumentation-grpc/build/src/grpc-js/serverUtils';
import { EventEmitter } from 'events';
import { AttributeNames } from '@opentelemetry/instrumentation-grpc/build/src/enums/AttributeNames';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import {createAndAddBodyCapture, addMetadataToSpan} from "./GrpcJsHypertraceInstrumentation";

/**
 * Execute grpc client call. Apply completitionspan properties and end the
 * span on callback or receiving an emitted event.
 */
export function makeGrpcClientRemoteCall(
    original: GrpcClientFunc,
    args: unknown[],
    metadata: grpcJs.Metadata,
    self: grpcJs.Client
): (span: Span) => EventEmitter {
    /**
     * Patches a callback so that the current span for this trace is also ended
     * when the callback is invoked.
     */
    function patchedCallback(
        span: Span,
        callback: SendUnaryDataCallback<ResponseType>
    ) {
        const wrappedFn: SendUnaryDataCallback<ResponseType> = (
            err: grpcJs.ServiceError | null,
            res: any
        ) => {
            createAndAddBodyCapture(span, res, 'response')
            if (err) {
                if (err.code) {
                    span.setStatus(_grpcStatusCodeToSpanStatus(err.code));
                    span.setAttribute(
                        SemanticAttributes.RPC_GRPC_STATUS_CODE,
                        err.code.toString()
                    );
                }
                span.setAttributes({
                    [AttributeNames.GRPC_ERROR_NAME]: err.name,
                    [AttributeNames.GRPC_ERROR_MESSAGE]: err.message,
                });
            } else {
                span.setStatus({ code: SpanStatusCode.UNSET });
                span.setAttribute(
                    SemanticAttributes.RPC_GRPC_STATUS_CODE,
                    SpanStatusCode.OK.toString() // this wasn't matching server behavior of unset = Ok
                );
            }

            span.end();
            callback(err, res);
        };
        return context.bind(context.active(), wrappedFn);
    }

    return (span: Span) => {
        // if unary or clientStream
        if (!original.responseStream) {
            const callbackFuncIndex = args.findIndex(arg => {
                return typeof arg === 'function';
            });
            if (callbackFuncIndex !== -1) {
                args[callbackFuncIndex] = patchedCallback(
                    span,
                    args[callbackFuncIndex] as SendUnaryDataCallback<ResponseType>
                );
            }
        }

        span.setAttributes({
            [AttributeNames.GRPC_METHOD]: original.path,
            [AttributeNames.GRPC_KIND]: SpanKind.CLIENT,
        });

        setSpanContext(metadata);
        const call = original.apply(self, args);
        call.on('metadata', (metadata) => {
            addMetadataToSpan(span, metadata, 'response')
        })

        // if server stream or bidi
        if (original.responseStream) {
            // Both error and status events can be emitted
            // the first one emitted set spanEnded to true
            let spanEnded = false;
            const endSpan = () => {
                if (!spanEnded) {
                    span.end();
                    spanEnded = true;
                }
            };
            context.bind(context.active(), call);
            call.on('error', (err: grpcJs.ServiceError) => {
                if (call[CALL_SPAN_ENDED]) {
                    return;
                }
                call[CALL_SPAN_ENDED] = true;

                span.setStatus({
                    code: _grpcStatusCodeToOpenTelemetryStatusCode(err.code),
                    message: err.message,
                });
                span.setAttributes({
                    [AttributeNames.GRPC_ERROR_NAME]: err.name,
                    [AttributeNames.GRPC_ERROR_MESSAGE]: err.message,
                });

                endSpan();
            });

            call.on('status', (status: SpanStatus) => {
                if (call[CALL_SPAN_ENDED]) {
                    return;
                }
                call[CALL_SPAN_ENDED] = true;

                span.setStatus(_grpcStatusCodeToSpanStatus(status.code));

                endSpan();
            });
        }
        return call;
    };
}

/**
 * Returns the metadata argument from user provided arguments (`args`)
 */
export function getMetadata(
    this: GrpcJsInstrumentation,
    grpcClient: typeof grpcJs,
    original: GrpcClientFunc,
    args: Array<unknown | grpcJs.Metadata>
): grpcJs.Metadata {
    let metadata: grpcJs.Metadata;

    // This finds an instance of Metadata among the arguments.
    // A possible issue that could occur is if the 'options' parameter from
    // the user contains an '_internal_repr' as well as a 'getMap' function,
    // but this is an extremely rare case.
    let metadataIndex = args.findIndex((arg: unknown | grpcJs.Metadata) => {
        return (
            arg &&
            typeof arg === 'object' &&
            (arg as grpcJs.Metadata)['internalRepr'] && // changed from _internal_repr in grpc --> @grpc/grpc-js https://github.com/grpc/grpc-node/blob/95289edcaf36979cccf12797cc27335da8d01f03/packages/grpc-js/src/metadata.ts#L88
            typeof (arg as grpcJs.Metadata).getMap === 'function'
        );
    });
    if (metadataIndex === -1) {
        metadata = new grpcClient.Metadata();
        if (!original.requestStream) {
            // unary or server stream
            metadataIndex = 1;
        } else {
            // client stream or bidi
            metadataIndex = 0;
        }
        args.splice(metadataIndex, 0, metadata);
    } else {
        metadata = args[metadataIndex] as grpcJs.Metadata;
    }
    return metadata;
}

/**
 * Inject opentelemetry trace context into `metadata` for use by another
 * grpc receiver
 * @param metadata
 */
export function setSpanContext(metadata: grpcJs.Metadata): void {
    propagation.inject(context.active(), metadata, {
        set: (metadata, k, v) => metadata.set(k, v as grpcJs.MetadataValue),
    });
}