import {AgentForTest} from "./AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import {expect} from "chai";
import {httpRequest} from "./HttpRequest";
import {Config} from "../../src";

describe('Koa tests', () => {
    const Koa = require('koa');
    const Router = require('koa-router');
    const bodyParser = require('koa-bodyparser');
    const app = new Koa();
    app.use(bodyParser({enableTypes: ['json']}));
    let router = new Router();

    router.get('/test', (ctx : any, next : any) => {
        ctx.body = { 'status': 'success' }
    });

    router.post('/test_post', (ctx : any, next : any) => {
        ctx.body = { 'status': 'post_success' }
    });

    app.use(router.routes()).use(router.allowedMethods());
    let server : any;
    before(()=> {
        server = app.listen(8000)
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
                    'Content-Type': "application/json"
                }
            },
            JSON.stringify({"test": "req data"}))

        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let serverSpan = spans[0]
        expect(serverSpan.attributes['http.request.body']).to.eql("{\"test\":\"req data\"}")
        expect(serverSpan.attributes['http.response.body']).to.eql("{\"status\":\"post_success\"}")
    })

    it('will collect only configured max body size', async () => {
        let original = Config.getInstance().config.data_capture.body_max_size_bytes
        Config.getInstance().config.data_capture.body_max_size_bytes = 10
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
        expect(serverSpan.attributes['http.request.body']).to.eql("{\"test\":\"r")
        expect(serverSpan.attributes['http.response.body']).to.eql("{\"status\":")
        Config.getInstance().config.data_capture.body_max_size_bytes = original
    })
});