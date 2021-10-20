'use strict';

/**
 * Require and initialize the @hypertrace/nodejsagent before all the other nodejs
 * imports.
 * Pass in the serviceName and collectorUrl in the config when initializing the agent.
 * */
const express = require("express");
var bodyParser = require('body-parser');
var http = require('http');


// Constants
const PORT = 8001;
const HOST = '127.0.0.1';

let PERSISTED_GRAPHQL_QUERY = {
  "7f56e67dd21ab3f30d1ff8b7bed08893f0a0db86449836189b361dd1e56ddb4b": '{ __typename }',
  "f8163d3542fbf8d901a58aca8421057277e6e5d58d95c4bd1cfa2b68a1063eaa": '{books {title author}}'
}

// App
const app = express();

app.use(bodyParser.json({
  strict: false
}));

app.get('/test', (req, res) => {
  res.send({ 'status': 'get_success' });
})

app.post('/graphql-forward', (req, res) => {
  let sha256 = req.body.hash

  let extensions = undefined
  let query = undefined
  if(PERSISTED_GRAPHQL_QUERY[sha256]) {
    extensions = JSON.stringify({
      "persistedQuery": {
        "version": 1,
        sha256Hash: sha256
      }
    })
  } else {
    query = req.body.query
  }

  let path = encodeURI(`/graphql?${query ? `query=${query}` : ''}`)
  console.log(`forwarding request to graphql server with url: ${path}`)
  http.request({ host: 'localhost', port: 4000, path: path }, (res2) => {
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
})

// curl localhost:8080/
app.get('/', (req, res) => {
  console.log(JSON.stringify(req.headers));
  http.request({ host: 'localhost', port: 8002, path: '/' }, (res2) => {
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
