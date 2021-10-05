import {AgentForTest} from "./AgentForTest";
const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import {expect} from "chai";
import * as http from "http";
import {httpRequest} from "./HttpRequest";

describe('Agent tests', () => {
    const express = require('express');
    let bodyParser = require('body-parser')

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.get('/test', (req : any, res: any) => {
        res.send({ 'status': 'success' });
    })
    app.post('/test_post', (req : any, res: any) => {
        let d = req.body
        res.send({ 'status': 'post_success' });
    })

    let server = http.createServer(app)

    before((done)=> {
        server.listen(8000)
        server.on('listening', () => {done()})
    })

    afterEach( ()=> {
        agentTestWrapper.stop()
    })

    after(()=> {
        server.close()
    })

    it('can capture request & response headers', async () => {
        let headers = {
            "some-header": "a-value",
            "Another_Header": "another_value"
        }
        await httpRequest.get({headers: headers, host: 'localhost', port: 8000, path: '/test'})
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

    it('can capture request & response bodies', async () => {
        await httpRequest.post({
            host: 'localhost',
            port: 8000,
            path: '/test_post',
            headers: {
                'content-type': "application/json"
            }
        },
        JSON.stringify({"test": "req data"}))

        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let serverSpan = spans[0]
        expect(serverSpan.attributes['http.request.body']).to.eql("{\"test\":\"req data\"}")
        expect(serverSpan.attributes['http.response.body']).to.eql("{\"status\":\"post_success\"}")
    })

    it('will respect max body request size', async () => {
        agentTestWrapper.config.config.data_capture.body_max_size_bytes = 10
        await httpRequest.post({
                host: 'localhost',
                port: 8000,
                path: '/test_post',
                headers: {
                    'content-type': "application/json"
                }
            },
            JSON.stringify({"test": "req data"}))

        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let serverSpan = spans[0]
        expect(serverSpan.attributes['http.request.body']).to.eql("{\"test\":\"req data\"}")
        expect(serverSpan.attributes['http.response.body']).to.eql("{\"status\":\"post_success\"}")
    })
});