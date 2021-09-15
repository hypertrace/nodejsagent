import {AgentForTest} from "./AgentForTest";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

import {expect} from "chai";
import * as http from "http";
import {httpRequest} from "./HttpRequest";

describe('Agent tests', () => {
    const express = require('express');

    const app = express();

    app.get('/test', (req : any, res: any) => {
        res.send({ 'status': 'success' });
    })
    let server = http.createServer(app)

    before((done)=> {
        server.listen(8000)
        server.on('listening', () => {done()})
    })

    after( ()=> {
        server.close()
        agentTestWrapper.stop()
    })

    it('can be initialized', async () => {
        const response = await httpRequest.get('http://localhost:8000/test')
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let requestSpanAttributes = spans[0].attributes
        expect(requestSpanAttributes['http.method']).to.equal('GET')
        expect(requestSpanAttributes['net.host.name']).to.equal('localhost')
        expect(requestSpanAttributes['http.route']).to.equal('/test')
        expect(requestSpanAttributes['http.target']).to.equal('/test')
        expect(requestSpanAttributes['net.transport']).to.equal('ip_tcp')
        expect(requestSpanAttributes['http.status_code']).to.equal(200)
        expect(spans[0].name).to.equal('GET /test')

        let serverSpanAttributes = spans[1].attributes
        expect(serverSpanAttributes['http.method']).to.equal('GET')
        expect(serverSpanAttributes['net.peer.name']).to.equal('localhost')
        expect(serverSpanAttributes['http.target']).to.equal('/test')
        expect(serverSpanAttributes['net.transport']).to.equal('ip_tcp')
        expect(serverSpanAttributes['http.status_code']).to.equal(200)
        expect(spans[1].name).to.equal('HTTP GET')
    });
});