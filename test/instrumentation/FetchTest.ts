import {AgentForTest} from "./AgentForTest";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

import {expect} from "chai";
import * as http from "http";
import {httpRequest} from "./HttpRequest";
import {Framework} from "../../src/instrumentation/Framework";
import {SpanKind} from "@opentelemetry/api";
import semver = require("semver/preload");

describe('Agent tests', () => {
    const requestListener = async function (req, res) {
        let body = ''
        if(req.url.indexOf("do-fetch") > -1){
            await fetch("http://localhost:8000/nested-call")
            res.setHeader("Content-Type", "application/json")
            res.writeHead(200)
            res.end(`{"nested-call": "true"}`)
        }
        if(req.method == "POST") {
            req.on('data', (data) => {body += data})
            req.on('end', (data) => {
                body += data
                res.setHeader("Content-Type", "application/json")
                res.writeHead(200);
                res.end(`{"test post": "data"}`);
            })
        } else {
            res.setHeader("Content-Type", "application/json")
            res.writeHead(200);
            res.end(`{"test": "data"}`);
        }
    }

    let server = http.createServer(requestListener)

    let originalIncludeExpress = Framework.getInstance().isExpressBased
    let originalOnlyExpress = Framework.getInstance().isExpressBased
    let originalanyFrameworks = Framework.getInstance().anyFrameworks
    before((done)=> {
        const currentNodeVersion = process.version;
        if (semver.lt(currentNodeVersion, '18.0.0')) {
            // @ts-ignore
            this.skip();
        }
        Framework.getInstance().isExpressBased = () => {return false}
        Framework.getInstance().isPureExpress = () => {return false}
        Framework.getInstance().anyFrameworks = () => {return false}
        server.listen(8000)
        server.on('listening', () => {done()})
    })

    afterEach(() => {
        agentTestWrapper.stop()
    })

    after( ()=> {
        Framework.getInstance().isExpressBased = originalIncludeExpress
        Framework.getInstance().isPureExpress = originalOnlyExpress
        Framework.getInstance().anyFrameworks = originalanyFrameworks
        server.close()
        agentTestWrapper.stop()
    })

    it('can capture GET requests', async () => {
        const response = await fetch('http://localhost:8000/some/path/segment');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let serverSpanAttributes = spans[0].attributes
        expect(serverSpanAttributes["net.peer.ip"]).to.exist
        expect(serverSpanAttributes['http.method']).to.equal('GET')
        expect(serverSpanAttributes['net.host.name']).to.equal('localhost')
        expect(serverSpanAttributes['http.target']).to.equal('/some/path/segment')
        expect(serverSpanAttributes['net.transport']).to.equal('ip_tcp')
        expect(serverSpanAttributes['http.status_code']).to.equal(200)

        let requestSpanAttributes = spans[1].attributes
        expect(requestSpanAttributes['http.method']).to.equal('GET')
        expect(requestSpanAttributes['net.peer.name']).to.equal('localhost')
        expect(requestSpanAttributes['http.target']).to.equal('/some/path/segment')
        expect(requestSpanAttributes['http.status_code']).to.equal(200)
        expect(spans[1].name).to.equal('GET /some/path/segment')
    });

    it('can capture response bodies', async () => {
        const data = {
            key1: 'value1',
            key2: 'value2'
        };

        const response = await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let serverSpanAttributes = spans[0].attributes
        expect(serverSpanAttributes['http.response.body']).to.equal(`{"test post": "data"}`)

        let requestSpanAttributes = spans[1].attributes
        expect(requestSpanAttributes['http.response.body']).to.equal(`{"test post": "data"}`)
    });

    it('can capture request body data', async () => {
        const response = await httpRequest.post({
                host: 'localhost',
                port: 8000,
                path: '/',
                headers: {
                    "Some-Header": "Foo-Bar",
                    "Content-Type": "application/json"
                }
            },
            JSON.stringify({data: "123"})
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let serverSpanAttributes = spans[0].attributes
        expect(serverSpanAttributes['http.request.body']).to.equal(`{"data":"123"}`)

        let requestSpanAttributes = spans[1].attributes
        expect(requestSpanAttributes['http.request.body']).to.equal(`{"data":"123"}`)
    });

    it('correlates server span with nested client fetch calls', async () => {
        const response = await httpRequest.post({
                host: 'localhost',
                port: 8000,
                path: '/do-fetch',
                headers: {
                    "Some-Header": "Foo-Bar",
                    "Content-Type": "application/json"
                }
            },
            JSON.stringify({data: "123"})
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(4)
        // @ts-ignore
        expect(spans[1].parentSpanId).to.equal(spans[2]._spanContext.spanId)
        expect(spans[1].kind).to.equal(SpanKind.CLIENT)
        expect(spans[2].kind).to.equal(SpanKind.SERVER)
    });

    it('should capture errors in spans when the server is unreachable', async () => {
        let errorCaught = false;
        try {
            await fetch('http://localhost:9999/');
        } catch (e) {
            errorCaught = true;
        }
        expect(errorCaught).to.be.true;

        let spans = agentTestWrapper.getSpans();
        expect(spans.length).to.equal(1);
        let spanAttributes = spans[0].attributes;
        expect(spanAttributes['http.method']).to.equal('GET');
        expect(spanAttributes['http.url']).to.equal('http://localhost:9999/');
        expect(spans[0].events.some(event => event.name === 'exception')).to.be.true;
    });

});