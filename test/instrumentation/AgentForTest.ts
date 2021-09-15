// This allows us to instantiate an agent that comes prepared with an InMemorySpanExporter
import {HypertraceAgent} from "../../src";
import {
    InMemorySpanExporter,
    ReadableSpan,
    SimpleSpanProcessor,
    SpanExporter
} from "@opentelemetry/tracing";

export class AgentForTest extends HypertraceAgent {
    private static instance: AgentForTest;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        super()
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
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
    }
}