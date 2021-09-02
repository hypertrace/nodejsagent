'use strict';

/**
 * Require and initialize the @hypertrace/nodejsagent before all the other nodejs
 * imports.
 * Pass in the serviceName and collectorUrl in the config when initializing the agent.
 * */
var hypertraceagent = require('@hypertrace/nodejsagent')
let config = hypertrace.config.v1.AgentConfig
let customConfig = config.create()
customConfig.serviceName = "asdf"
const hypertracetracer = new hypertraceagent.HypertraceAgent();

const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 8081;
const HOST = '127.0.0.1';


// App
const app = express();

app.use(bodyParser.json({
  strict: false
}))

// curl localhost:8081/
app.get('/', (req, res) => {
  res.send({ 'status': 'home_success' });
});

// curl -X POST -H "Content-Type: application/json" -d '{"a1":"v1","b1":"c1"}' localhost:8081/foo
app.post('/foo', (req, res) => {
  console.log(JSON.stringify(req.body));
  res.send({ 'status': 'foo_success' });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
