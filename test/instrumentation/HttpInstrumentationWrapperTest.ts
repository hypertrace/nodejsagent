import {AgentForTest} from "./AgentForTest";
const agentTestWrapper = AgentForTest.getInstance()
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

    it('can capture request & response headers', async () => {
        let headers = {
            "some-header": "a-value",
            "Another_Header": "another_value"
        }
        const response = await httpRequest.get({headers: headers, host: 'localhost', port: 8000, path: '/test'})
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let requestSpanAttributes = spans[0].attributes
        expect(requestSpanAttributes['http.request.header.another_header']).to.equal('another_value')
        expect(requestSpanAttributes['http.request.header.some-header']).to.equal('a-value')
        expect(requestSpanAttributes['http.response.header.x-powered-by']).to.equal('Express')
        expect(requestSpanAttributes['http.response.header.content-type']).to.equal('application/json; charset=utf-8')

        let serverSpanAttributes = spans[1].attributes
        expect(serverSpanAttributes['http.request.header.some-header']).to.equal('a-value')
        expect(serverSpanAttributes['http.request.header.another_header']).to.equal('another_value')
        expect(spans[1].name).to.equal('HTTP GET')
    });
});