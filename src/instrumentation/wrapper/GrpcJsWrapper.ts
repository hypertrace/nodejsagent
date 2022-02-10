import {context, trace} from "@opentelemetry/api";
import {Config} from "../../config/config";
import {available} from "./ExpressWrapper";
import {addMetadataToSpan} from "../GrpcJsHypertraceInstrumentation";
import {ServerUnaryCallImpl} from "@grpc/grpc-js/build/src/server-call";


let patched = false
const shimmer = require('shimmer');

function MetadataCaptureWithConfig(config: any): Function {
    return function (original: Function) {
        const metadataCaptureEnabled = config.config.data_capture.rpc_metadata.response
        return function () {
            let span = trace.getSpan(context.active())
            if (metadataCaptureEnabled && span) {
                addMetadataToSpan(span, arguments[0], 'response')
            }
            return original.apply(this, arguments)
        }
    }
}

export function patchGrpc() {
    if (!available('@grpc/grpc-js') || patched) {
        return
    }
    patched = true
    shimmer.wrap(ServerUnaryCallImpl.prototype, 'sendMetadata', MetadataCaptureWithConfig(Config.getInstance()))
}