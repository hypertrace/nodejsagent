'use strict';

/**
 * Require and initialize the @hypertrace/nodejsagent before all the other nodejs
 * imports.
 * Pass in the serviceName and collectorUrl in the config when initializing the agent.
 * */
var hypertraceagent = require('@hypertrace/nodejsagent');
const COLLECTOR_ENDPOINT = process.env.COLLECTOR_ENDPOINT || "127.0.0.1:9411";
const hypertracetracer = new hypertraceagent.HypertraceAgent(
  {
    serviceName: "server-a",
    collectorUrl: "http://" + COLLECTOR_ENDPOINT + "/api/v2/spans"
  });

const express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

// Constants
const PORT = 8080;
const HOST = '127.0.0.1';

// App
const app = express();

app.use(bodyParser.json({
  strict: false
}));

// curl localhost:8080/
app.get('/', (req, res) => {
  console.log(JSON.stringify(req.headers));
  http.request({ host: 'localhost', port: 8081, path: '/' }, (res2) => {
    var str = "";

    res2.on('data', (chunk) => {
      str += chunk;
    })

    res2.on('end', () => {
      console.log(str);
      res.setHeader("Content-Type", "application/json");
      res.send(str);
    })
  }).end()
});

// curl -X POST -H "Content-Type: application/json" -d '{"a1":"v1","b1":"c1"}' localhost:8080/handlePost
app.post('/handlePost', (req, res) => {
  console.log(JSON.stringify(req.body));
  res.send({ 'status': 'post_success' });
});

// curl -X POST -H "Content-Type: application/json" -d '{"a1":"v1","b1":"c1"}' localhost:8080/echo
app.post('/echo', (req, res) => {
  console.log(JSON.stringify(req.headers));
  console.log(JSON.stringify(req.body));
  // Testing whether lua set dynamic metadata flows through
  var xRequestIdHeader = req.header('x-request-id')
  if (xRequestIdHeader != undefined && xRequestIdHeader != null && xRequestIdHeader != '') {
    res.setHeader('x-request-id', xRequestIdHeader)
  }
  res.send(req.body);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
