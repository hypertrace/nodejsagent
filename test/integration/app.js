// Initialize compression module
const express = require('express');
const app = express();
const agent = require("@hypertrace/nodejsagent")
const framework = require("@hypertrace/nodejsagent/lib/instrumentation/Framework");
framework.Framework.getInstance().isPureExpress = () => {return true}
const agentI = new agent.HypertraceAgent()
class SampleFilter  {
    evaluateUrlAndHeaders(span, url, headers, requestType) {
        for(const [k, _] of Object.entries(headers)){
            if(k == 'x-filter-test'){
                return true
            }
        }
        return false
    }

    evaluateBodyAndHeaders(span, headers, body, requestType) {
        return body.indexOf('block-this-body') > -1
    }
}

agent.Registry.getInstance().register(new SampleFilter());
agentI.instrument()

app.get('/test', (req, res) => {
    res.send("Hello")
});


// Server setup
app.listen(8087, function () {
    console.log('Server listening on port 8087!');
});