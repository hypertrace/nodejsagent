import {HypertraceAgent} from "./HypertraceAgent";
import {Registry} from "./filter/Registry";
import * as filter from "./filter/Filter";
module.exports.HypertraceAgent = HypertraceAgent
module.exports.Registry = Registry;
export type IFilter = filter.IFilter


if(process.execArgv && process.execArgv.indexOf('@hypertrace/nodejsagent') > 0) {
    const agentInstance = new HypertraceAgent()
    agentInstance.instrument()
}
