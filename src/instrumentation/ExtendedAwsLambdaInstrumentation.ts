import { AwsLambdaInstrumentation } from "@opentelemetry/instrumentation-aws-lambda";
import {SemanticAttributes, SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {SpanKind, SpanStatusCode, trace} from "@opentelemetry/api";
import {
    context as otelContext,
} from '@opentelemetry/api';
import {logger} from "../Logging";

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
                try{
                    // @ts-ignore
                    config.requestHook(span, {event, context: lambdaContext});
                }catch(e){
                    logger.debug("Error processing request hook")
                    logger.debug(e)
                }

            }

            return otelContext.with(trace.setSpan(otelContext.active(), span), async () => {
                try {
                    // Execute the original handler function
                    const result = await handler(event, lambdaContext, callback);

                    // @ts-ignore
                    if (config.responseHook) {
                        try{
                            // @ts-ignore
                            config.responseHook(span, {err: null, res: result});
                        }catch(e){
                            logger.debug("Error processing success state response hook")
                            logger.debug(e)
                        }

                    }

                    span.end();
                    try {
                        logger.debug("Exporting spans from node...")
                        await traceProvider.forceFlush()
                    }catch(e){
                        logger.error("Error exporting trace in extendedLambdaHandler original invoke attempt, continue without export")
                        logger.error(e)
                    }

                    return result;
                } catch (error) {
                    // @ts-ignore
                    if (config.responseHook) {
                        try{
                            // @ts-ignore
                            config.responseHook(span, {err: error});
                        }catch(e){
                            logger.debug("Error processing error state response hook")
                            logger.debug(e)
                        }

                    }

                    span.recordException(error);
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: error.message,
                    });
                    span.end();
                    try {
                        logger.debug("Exporting spans from node-agent...")
                        await traceProvider.forceFlush()
                    }catch(e){
                        logger.error("Error exporting trace in extendedLambdaHandler error handler, continue without export")
                        logger.error(e)
                    }
                    throw error; // Rethrow the error to ensure Lambda can handle it accordingly
                }
            });
        };
    }
}
