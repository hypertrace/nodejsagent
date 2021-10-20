import {HypertraceAgent} from "./HypertraceAgent";
module.exports = HypertraceAgent;

if(process.execArgv && process.execArgv.indexOf('@hypertrace/nodejsagent') > 0) {
    const agentInstance = new HypertraceAgent()
    agentInstance.instrument()
}
