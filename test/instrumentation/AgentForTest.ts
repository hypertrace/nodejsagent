// This allows us to instantiate an agent that comes prepared with an InMemorySpanExporter
import {HypertraceAgent} from "../../src";
import {Config} from '../../src/config/config'
import {
    InMemorySpanExporter,
    ReadableSpan,
    SimpleSpanProcessor,
    SpanExporter
} from "@opentelemetry/tracing";

export class AgentForTest extends HypertraceAgent {
    private static instance: AgentForTest;

    private constructor() {
        super()
    }

    public static getInstance(): AgentForTest {
        if (!AgentForTest.instance) {
            AgentForTest.instance = new AgentForTest();
        }

        return AgentForTest.instance;
    }

    getSpans(): ReadableSpan[] {
        return (<InMemorySpanExporter>this.exporter).getFinishedSpans()
    }

    protected createExporter(traceReporterType: string): SpanExporter {
        return new InMemorySpanExporter();
    }

    protected setupExporter(): SpanExporter {
        let exporter = this.createExporter(this.config.config.reporting.trace_reporter_type)

        this._provider.addSpanProcessor(
            new SimpleSpanProcessor(exporter)
        );
        return exporter
    }

    stop() {
        (<InMemorySpanExporter>this.exporter!).reset()
        Config.reset()
        Config.getInstance()
    }
}