import supertest = require("supertest");
import {AgentForTest} from "./AgentForTest";
import {InMemorySpanExporter} from "@opentelemetry/tracing";
import {expect} from "chai";


describe('Agent tests', () => {
    it('can be initialized', () => {
        const agentTestWrapper = new AgentForTest();
        agentTestWrapper.agent.instrument()

        const express = require('express');

        const app = express();

        app.get('/test', (req : any, res: any) => {
            res.send({ 'status': 'success' });
        })

        supertest(app)
            .get('/test')
            .then(function(result: any){
                let spans = (<InMemorySpanExporter>agentTestWrapper.agent.exporter).getFinishedSpans()
                // first span is http request
                // second span is server handling req
                expect(spans.length).to.equal(2)
                for(let span of spans){
                    let attributes = span.attributes
                    expect(attributes['http.method']).to.equal('GET')
                    expect(attributes['net.host.name']).to.equal('127.0.0.1')
                    expect(attributes['http.route']).to.equal('/test')
                    expect(attributes['http.target']).to.equal('/test')
                    expect(attributes['net.transport']).to.equal('ip_tcp')
                    expect(attributes['http.status_code']).to.equal(200)
                }

                expect(spans[0].name).to.equal('GET /test')
                expect(spans[1].name).to.equal('HTTP GET')
            })
    });
});