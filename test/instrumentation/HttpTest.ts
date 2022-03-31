import {AgentForTest} from "./AgentForTest";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

import {expect} from "chai";
import * as http from "http";
import {httpRequest} from "./HttpRequest";

describe('Agent tests', () => {
    const requestListener = function (req, res) {
        res.setHeader("Content-Type", "application/json")
        res.writeHead(200);
        res.end(`{"test": "data"}`);
    }

    let server = http.createServer(requestListener)

    before((done)=> {
        server.listen(8000)
        server.on('listening', () => {done()})
    })

    afterEach(() => {
        agentTestWrapper.stop()
    })

    after( ()=> {
        server.close()
        agentTestWrapper.stop()
    })

    it('can capture spans', async () => {
        const response = await httpRequest.get('http://localhost:8000/')
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let requestSpanAttributes = spans[0].attributes
        expect(requestSpanAttributes['http.method']).to.equal('GET')
        expect(requestSpanAttributes['net.host.name']).to.equal('localhost')
        expect(requestSpanAttributes['http.target']).to.equal('/')
        expect(requestSpanAttributes['net.transport']).to.equal('ip_tcp')
        expect(requestSpanAttributes['http.status_code']).to.equal(200)

        let serverSpanAttributes = spans[1].attributes
        expect(serverSpanAttributes['http.method']).to.equal('GET')
        expect(serverSpanAttributes['net.peer.name']).to.equal('localhost')
        expect(serverSpanAttributes['http.target']).to.equal('/')
        expect(serverSpanAttributes['net.transport']).to.equal('ip_tcp')
        expect(serverSpanAttributes['http.status_code']).to.equal(200)
        expect(spans[1].name).to.equal('HTTP GET')
    });

    it('can capture response body data', async () => {
        const response = await httpRequest.get('http://localhost:8000/')
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let requestSpanAttributes = spans[0].attributes
        expect(requestSpanAttributes['http.response.body']).to.equal(`{"test": "data"}`)

        let serverSpanAttributes = spans[1].attributes
        expect(serverSpanAttributes['http.response.body']).to.equal(`{"test": "data"}`)
    });

    it('can capture request body data', async () => {
        const response = await httpRequest.post({
                host: 'localhost',
                port: 8000,
                path: '/',
                headers: {
                    "Content-Type": "application/json"
                }
            },
            JSON.stringify({data: "123"})
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let requestSpanAttributes = spans[0].attributes
        expect(requestSpanAttributes['http.response.body']).to.equal(`{"test": "data"}`)

        let serverSpanAttributes = spans[1].attributes
        expect(serverSpanAttributes['http.response.body']).to.equal(`{"test": "data"}`)
    });


});