'use strict';

/**
 * Require and initialize the @hypertrace/nodejsagent before all the other nodejs
 * imports.
 * Pass in the serviceName and collectorUrl in the config when initializing the agent.
 * */
var hypertraceagent = require('@hypertrace/nodejsagent');
const hypertracetracer = new hypertraceagent.HypertraceAgent(
  {
    serviceName: "server-a",
    collectorUrl: "http://localhost:9411/api/v2/spans"
  });

const express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(bodyParser.json({
  strict: false
}));

// curl localhost:8080/
app.get('/', (req, res) => {
  console.log(JSON.stringify(req.headers));
  http.request({host: 'localhost', port: 8081, path: '/'}, (res2) => {
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
  res.send({'status':'post_success'});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
