import {NodeTracerProvider} from '@opentelemetry/node';
import {BatchSpanProcessor, InMemorySpanExporter, SpanExporter} from '@opentelemetry/tracing';
import {ZipkinExporter} from '@opentelemetry/exporter-zipkin';
import {Config} from './config/config'
import {HttpInstrumentation} from "@opentelemetry/instrumentation-http";
import {ExpressInstrumentation} from "@opentelemetry/instrumentation-express";
import {ExpressLayerType} from "@opentelemetry/instrumentation-express/build/src/enums/ExpressLayerType";
import {CollectorTraceExporter} from "@opentelemetry/exporter-collector";
import {hypertrace} from "./config/generated";
import {CompositePropagator, HttpTraceContextPropagator} from "@opentelemetry/core";
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

const api = require("@opentelemetry/api");

const {Resource} = require('@opentelemetry/resources');
const {SemanticResourceAttributes} = require('@opentelemetry/semantic-conventions');

const {registerInstrumentations} = require('@opentelemetry/instrumentation');


export class HypertraceAgent {
    _provider: NodeTracerProvider;
    public config: Config
    public exporter: SpanExporter | undefined

    public constructor() {
        this.config = Config.getInstance()
        this._provider = this.setupTracingProvider()
    }

    instrument(): () => void {
        this.setup()
        let httpWrapper = new HttpInstrumentationWrapper(this.config.config)

        patchExpress()
        return registerInstrumentations({
            tracerProvider: this._provider,
            instrumentations: [
                new HttpInstrumentation({
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
                new MySQLInstrumentation(),
                new MySQL2Instrumentation(),
                new PgInstrumentation(),
                new MongoDBInstrumentation()
            ]
        });
    }

    setup() {
        this.exporter = this.setupExporter()
        this.setupPropagation()
        this._provider.register()
    }


    private setupTracingProvider(): NodeTracerProvider {
        return new NodeTracerProvider({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: this.config.config.service_name,
                'service.instance.id': process.pid,
                'telemetry.sdk.version': '0.0.0', // TODO - needs to pull from package.json
                'telemetry.sdk.name': 'hypertrace',
                'telemetry.sdk.language': 'node'
            })
            // TODO - append custom attributes from config
        })
    }

    private setupPropagation() {
        let formats: TextMapPropagator[] = []
        for (let propagationType of this.config.config.propagation_formats) {
            if (propagationType == 'TRACECONTEXT') {
                formats.push(new HttpTraceContextPropagator())
            } else if (propagationType == "B3") {
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
            return new ZipkinExporter({
                url: this.config.config.reporting.endpoint
            })
        } else if (traceReporterType == 'LOGGING') {
            return new InMemorySpanExporter()
        } else {
            return new CollectorTraceExporter({
                url: this.config.config.reporting.endpoint
            })
        }
    }
}
