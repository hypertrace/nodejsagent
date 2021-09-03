// This allows us to instantiate an agent that comes prepared with an InMemorySpanExporter
import {hypertrace} from "../../src/config/generated";
import {HypertraceAgent} from "../../src";
import {DEFAULT_AGENT_CONFIG} from "../../src/config/defaults";
import {InMemorySpanExporter, ReadableSpan, SimpleSpanProcessor} from "@opentelemetry/tracing";

export class AgentForTest {
    public agent: HypertraceAgent;
    public memoryExporter: InMemorySpanExporter
    constructor() {
        // if you want to debug locally you can change the following values to ZIPKIN & your zipkin endpoint to
        // report test data locally
        // DEFAULT_AGENT_CONFIG['reporting']['endpoint'] = 'http://localhost:9411/api/v2/spans'
        this.agent = new HypertraceAgent()
        this.memoryExporter = new InMemorySpanExporter();
        const spanProcessor = new SimpleSpanProcessor(this.memoryExporter);
        this.agent._provider.addSpanProcessor(spanProcessor);
    }

    getSpans(): ReadableSpan[] {
        return this.memoryExporter.getFinishedSpans()
    }
}