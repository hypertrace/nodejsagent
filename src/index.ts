import {HypertraceAgent} from "./HypertraceAgent";
import {Registry} from "./filter/Registry";
module.exports = {
    HypertraceAgent, Registry
}

if(process.execArgv && process.execArgv.indexOf('@hypertrace/nodejsagent') > 0) {
    const agentInstance = new HypertraceAgent()
    agentInstance.instrument()
}
