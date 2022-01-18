// This allows us to instantiate an agent that comes prepared with an InMemorySpanExporter
import {HypertraceAgent} from "../../src/HypertraceAgent";
import {Config} from '../../src/config/config'
import {
    InMemorySpanExporter,
    ReadableSpan,
    SimpleSpanProcessor,
    SpanExporter
} from '@opentelemetry/sdk-trace-base'

export class AgentForTest extends HypertraceAgent {
    private static instance: AgentForTest;

    private constructor(overrideVersion?: string) {
        super(overrideVersion)
    }

    public static renew(overrideVersion?: string) {
        AgentForTest.instance = new AgentForTest(overrideVersion)
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
        //return new CollectorTraceExporter({url: 'http://localhost:4317'});
        //return new ZipkinExporter({url: 'http://localhost:9411/api/v2/spans'})
        return new InMemorySpanExporter()
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