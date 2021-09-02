// This allows us to instantiate an agent that comes prepared with an InMemorySpanExporter
import {hypertrace} from "../../src/instrumentation/config/generated";
import {HypertraceAgent} from "../../src";
import {DEFAULT_AGENT_CONFIG} from "../../src/instrumentation/config/defaults";

export class AgentForTest {
    public agent: HypertraceAgent;

    constructor() {
        // if you want to debug locally you can change the following values to ZIPKIN & your zipkin endpoint to
        // report test data locally
        DEFAULT_AGENT_CONFIG['reporting']['trace_reporter_type'] = 'LOGGING'
        // DEFAULT_AGENT_CONFIG['reporting']['endpoint'] = 'http://localhost:9411/api/v2/spans'
        this.agent = new HypertraceAgent()
    }
}