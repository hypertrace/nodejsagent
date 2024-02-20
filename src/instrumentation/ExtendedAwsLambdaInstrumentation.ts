import { AwsLambdaInstrumentation } from "@opentelemetry/instrumentation-aws-lambda";
import {SemanticAttributes, SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {SpanKind, SpanStatusCode, trace} from "@opentelemetry/api";
import {
    context as otelContext,
} from '@opentelemetry/api';

import {VERSION} from "@opentelemetry/instrumentation-aws-lambda/build/src/version"

export class ExtendedAwsLambdaInstrumentation extends AwsLambdaInstrumentation {
    public static TraceLambda(handler, config = {}, traceProvider) {
        const tracer = trace.getTracer(super.name, VERSION);

        return async function tracedHandler(event, lambdaContext, callback) {
            const spanName = lambdaContext.functionName || 'Lambda Function';
            const span = tracer.startSpan(spanName, {
                kind: SpanKind.SERVER,
                attributes: {
                    [SemanticAttributes.FAAS_EXECUTION]: lambdaContext.awsRequestId,
                    [SemanticResourceAttributes.FAAS_ID]: lambdaContext.invokedFunctionArn,
                },
            });

            // @ts-ignore
            if (config.requestHook) {
                // @ts-ignore
                config.requestHook(span, {event, context: lambdaContext});
            }

            return otelContext.with(trace.setSpan(otelContext.active(), span), async () => {
                try {
                    // Execute the original handler function
                    const result = await handler(event, lambdaContext, callback);

                    // @ts-ignore
                    if (config.responseHook) {
                        // @ts-ignore
                        config.responseHook(span, {err: null, res: result});
                    }

                    span.end();
                    await traceProvider.forceFlush()

                    return result;
                } catch (error) {
                    // @ts-ignore
                    if (config.responseHook) {
                        // @ts-ignore
                        config.responseHook(span, {err: error});
                    }

                    span.recordException(error);
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: error.message,
                    });
                    span.end();
                    await traceProvider.forceFlush()
                    throw error; // Rethrow the error to ensure Lambda can handle it accordingly
                }
            });
        };
    }
}
