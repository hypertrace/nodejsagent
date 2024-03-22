// need to load patch first to load patch to support import and require
import {isCompatible} from "./instrumentation/InstrumentationCompat";

import {ExtendedAwsLambdaInstrumentation} from "./instrumentation/ExtendedAwsLambdaInstrumentation";
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {BatchSpanProcessor, InMemorySpanExporter, SpanExporter} from '@opentelemetry/sdk-trace-base';
import {ZipkinExporter} from '@opentelemetry/exporter-zipkin';
import {Config} from './config/config'
import {ExpressInstrumentation} from "@opentelemetry/instrumentation-express";
import {ExpressLayerType} from "@opentelemetry/instrumentation-express/build/src/enums/ExpressLayerType";
import {hypertrace} from "./config/generated";
import {CompositePropagator, W3CTraceContextPropagator} from "@opentelemetry/core";
import {B3Propagator} from "@opentelemetry/propagator-b3";
import {TextMapPropagator} from "@opentelemetry/api";
import {HttpInstrumentationWrapper} from "./instrumentation/HttpInstrumentationWrapper";
import {patchExpress} from "./instrumentation/wrapper/ExpressWrapper";
import {MySQLInstrumentation} from "@opentelemetry/instrumentation-mysql";
import {MySQL2Instrumentation} from "@opentelemetry/instrumentation-mysql2";
import {PgInstrumentation} from "@opentelemetry/instrumentation-pg";
import {MongoDBInstrumentation} from "@opentelemetry/instrumentation-mongodb";
import {KoaHypertraceInstrumentation} from "./instrumentation/KoaHypertraceInstrumentation";
import {KoaLayerType} from "@opentelemetry/instrumentation-koa/build/src/types";
import {koaRequestCallback, koaResponseCallback} from "./instrumentation/wrapper/KoaWrapper";
import {GraphQLInstrumentation} from "@opentelemetry/instrumentation-graphql";
import {logger} from "./Logging";
import {version} from "./Version";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-grpc";
import {MongooseInstrumentation} from "@opentelemetry/instrumentation-mongoose";
import {GrpcJsHypertraceInstrumentation} from "./instrumentation/GrpcJsHypertraceInstrumentation";
import {patchClientRequest} from "./instrumentation/wrapper/OutgoingRequestWrapper";
import {HttpHypertraceInstrumentation} from "./instrumentation/HttpHypertraceInstrumentation";
import {patchSails} from "./instrumentation/wrapper/SailsWrapper";
import {Framework} from "./instrumentation/Framework";
import {LambdaRequestHook, LambdaResponseHook} from "./instrumentation/LambdaInstrumentationWrapper";
import {patchHapi} from "./instrumentation/wrapper/HapiWrapper";
import {ChannelCredentials} from "@grpc/grpc-js";

const api = require("@opentelemetry/api");
const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const {Resource} = require('@opentelemetry/resources');

const {registerInstrumentations} = require('@opentelemetry/instrumentation');
export const hypertraceDomain = require('domain').create();

export class HypertraceAgent {
    _provider: NodeTracerProvider;
    public config: Config
    public exporter: SpanExporter | undefined

    public constructor(overrideVersion?: string) {
        logger.info("Initializing Hypertrace Agent")
        logger.info(`Hypertrace Version: ${version}`)
        logger.info(`Node version: ${process.version}`)
        this.config = Config.getInstance()
        this._provider = this.setupTracingProvider(overrideVersion)
        logger.info("Successfully initialized Hypertrace Agent")
    }

    instrumentLambda(handlerFunc) {
        return ExtendedAwsLambdaInstrumentation.TraceLambda(handlerFunc, {
            requestHook: LambdaRequestHook,
            responseHook: LambdaResponseHook
        }, this._provider)
    }

    instrument() {
        hypertraceDomain.on('error', (er) => {
            // these should only be forbidden errors unless something is going wrong with our body capture
            // in either case, we don't want those exceptions to bubble outside of the agent
            logger.debug('Error caught within hypertrace domain')
            logger.debug(`error ${er.stack}`)
        })
        if (!Config.getInstance().config.enabled) {
            logger.info('Hypertrace disabled - not instrumenting')
            return false
        }
        logger.info('Hypertrace enabled - instrumenting')
        this.setup()
        let httpWrapper = new HttpInstrumentationWrapper(this.config.config)
        patchClientRequest()
        patchExpress()
        patchSails()

        let instrumentations = [
            new ExtendedAwsLambdaInstrumentation({
                requestHook: LambdaRequestHook,
                responseHook: LambdaResponseHook,
                disableAwsContextPropagation: true
            }),
            new HttpHypertraceInstrumentation({
                requestHook: httpWrapper.IncomingRequestHook,
                startOutgoingSpanHook: httpWrapper.OutgoingRequestHook,
                applyCustomAttributesOnSpan: httpWrapper.CustomAttrs,
                responseHook: httpWrapper.RespHook
            }),
            new ExpressInstrumentation({ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.REQUEST_HANDLER]}),
            new KoaHypertraceInstrumentation({
                ignoreLayersType: [KoaLayerType.MIDDLEWARE],
                requestCallback: koaRequestCallback,
                responseCallback: koaResponseCallback
            }),
            new GrpcJsHypertraceInstrumentation(),
            new GraphQLInstrumentation(),
            new MySQLInstrumentation(),
            new MySQL2Instrumentation(),
            new PgInstrumentation(),
            new MongoDBInstrumentation(),
            new MongooseInstrumentation()
        ]

        if (isCompatible("12.0.0")) {
            // Imports are only allowed at top level
            // so instead we need to require it if the node version is modern enough
            patchHapi()
            const hapiHypertraceInstrumentation = require("./instrumentation/HapiHypertraceInstrumentation")
            instrumentations.push(new hapiHypertraceInstrumentation.HapiHypertraceInstrumentation({}),)
        }

        registerInstrumentations({
            tracerProvider: this._provider,
            instrumentations: instrumentations
        });
        // if using express under es6 syntax http/https loading isnt captured
        // this ensures they are loaded immediately following instrumentation init
        const http = require('http')
        const https = require('https')
        return
    }

    setup() {
        this.exporter = this.setupExporter()
        this.setupPropagation()
        this._provider.register()
        logger.debug('Provider registered')
    }


    private setupTracingProvider(overrideVersion?: string): NodeTracerProvider {
        let reportedVersion = overrideVersion ? overrideVersion : version
        let resourceAttributes = {
            'service.name': this.config.config.service_name,
            'service.instance.id': process.pid,
            'telemetry.sdk.version': reportedVersion,
            'telemetry.sdk.name': 'hypertrace',
            'telemetry.sdk.language': 'nodejs'
        }
        let extraConfigAttributes = Config.getInstance().config.resource_attributes
        if (extraConfigAttributes) {
            Object.assign(resourceAttributes, extraConfigAttributes)
        }
        return new NodeTracerProvider({
            resource: new Resource(resourceAttributes)
        })
    }

    private setupPropagation() {
        let formats: TextMapPropagator[] = []
        for (let propagationType of this.config.config.propagation_formats) {
            if (propagationType == 'TRACECONTEXT') {
                logger.debug(`Adding tracecontext propagator`)
                formats.push(new W3CTraceContextPropagator())
            } else if (propagationType == "B3") {
                logger.debug(`Adding b3 propagator`)
                formats.push(new B3Propagator())
            }
        }
        if (formats.length == 0) {
            return
        }
        api.propagation.setGlobalPropagator(new CompositePropagator({propagators: formats}));
    }

    protected setupExporter(): SpanExporter {
        let exporter = this.createExporter(this.config.config.reporting.trace_reporter_type)

        this._provider.addSpanProcessor(
            new BatchSpanProcessor(exporter)
        );
        return exporter
    }

    protected createExporter(traceReporterType: string): SpanExporter {
        if (traceReporterType == 'ZIPKIN') {
            logger.info(`Creating zipkin exporter reporting to: ${this.config.config.reporting.endpoint}`)
            return new ZipkinExporter({
                url: this.config.config.reporting.endpoint
            })
        } else if (traceReporterType == 'LOGGING') {
            logger.info(`Creating in memory exporter`)
            return new InMemorySpanExporter()
        } else {
            logger.info(`Creating OTLP exporter reporting to: ${this.config.config.reporting.endpoint}`)
            const credentials = this.getGrpcCredentials()

            return new OTLPTraceExporter({
                url: this.config.config.reporting.endpoint,
                credentials,
            });
        }
    }

    getGrpcCredentials(): ChannelCredentials {
        if (this.config.config.reporting.cert_file.length > 0) {
            try {
                const certFileContent = fs.readFileSync(this.config.config.reporting.cert_file);
                return grpc.credentials.createSsl(certFileContent);
            } catch (error) {
                logger.error('Error reading TLS certificate file:', error);
                return grpc.credentials.createInsecure();
            }
        } else {
            return grpc.credentials.createInsecure();
        }
    }
}
