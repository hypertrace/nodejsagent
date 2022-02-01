import {AgentForTest} from "./AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import {expect} from "chai";
import * as http from "http";
import {httpRequest} from "./HttpRequest";
import {Registry} from "../../src/filter/Registry";
import {SampleFilter} from "./SampleFilter";
import {Framework} from "../../src/instrumentation/Framework";


describe('Simple app without middleware', () => {
    const express = require('express');

    const app = express();

    // app.use(body-parser)
    // app.use(express.json)
    // note the lack of any body parsing middleware

    app.post('/test_post', (req : any, res: any) => {
        let str = ''
        req.on('data', (chunk) => {
            str += chunk;
        })

        req.on('end', () => {
            res.setHeader("Content-Type", "application/json");
            res.send(str);
        })
    })

    let server = http.createServer(app)
    let originalImpl = Framework.getInstance().isPureExpress

    before((done)=> {
        Framework.getInstance().isPureExpress = () => {return true}
        server.listen(8000)
        server.on('listening', () => {done()})
    })

    afterEach( ()=> {
        agentTestWrapper.stop()
    })

    after(()=> {
        Framework.getInstance().isPureExpress = originalImpl
        server.close()
    })

    describe('filter api', () => {
        before(() => {
            Registry.getInstance().register(new SampleFilter())
        })

        after(() => {
            // @ts-ignore
            Registry.instance = undefined
        })

        it('will return a 403 if a body filter returns true', async() => {
        await httpRequest.post({
                host: 'localhost',
                port: 8000,
                path: '/test_post',
                headers: {
                    'Content-Type': "application/json",
                }
            },
            JSON.stringify({"test": "block-this-body"}))
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(2)
            let serverSpan = spans[0]
            expect(serverSpan.attributes['http.status_code']).to.equal(403)
            expect(serverSpan.attributes['http.status_text']).to.equal('FORBIDDEN')

            let requestSpan = spans[1]
            expect(requestSpan.attributes['http.status_code']).to.equal(403)
            expect(requestSpan.attributes['http.status_text']).to.equal('FORBIDDEN')
        })

        it('will return normal response if not filtered', async() => {
            await httpRequest.post({
                    host: 'localhost',
                    port: 8000,
                    path: '/test_post',
                    headers: {
                        'Content-Type': "application/json",
                    }
                },
                JSON.stringify({"test": "valid"}))


            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(2)
            let serverSpan = spans[0]
            expect(serverSpan.attributes['http.status_code']).to.equal(200)
            expect(serverSpan.attributes['http.status_text']).to.equal('OK')

            let requestSpan = spans[1]
            expect(requestSpan.attributes['http.status_code']).to.equal(200)
            expect(requestSpan.attributes['http.status_text']).to.equal('OK')
        })

    })
});
