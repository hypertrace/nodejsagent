import {AgentForTest} from "./AgentForTest";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

import {expect} from "chai";
import * as http from "http";
import {httpRequest} from "./HttpRequest";
import {Registry} from "../../src/filter/Registry";
import {SampleFilter} from "./SampleFilter";
import {IFilter} from "../../src/filter/Filter";
import {Span} from "@opentelemetry/api";
import {REQUEST_TYPE} from "../../lib/filter/Filter";
import {isCompatible} from "../../lib/instrumentation/InstrumentationCompat";
import {Framework} from "../../src/instrumentation/Framework";

//if(isCompatible("12.0.0") === true){
    const Hapi = require('@hapi/hapi');

    describe('Hapi tests', () => {

        const server = Hapi.server({
            port: 8000,
            host: 'localhost'
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {

                return 'Hello World!';
            }
        });
        server.route({
            method: 'POST',
            path: '/test-post',
            handler: (request, h) => {
                const data = request.payload
                console.log(data)
                let obj = {
                    test: 'post-data',
                    number: 1
                }
                const response = h.response(obj);
                response.header('X-Test-Header', 'some-value');
                return response;
            }
        });

        let expressBased = Framework.getInstance().isExpressBased
        let onlyExpress = Framework.getInstance().isPureExpress
        let noFrameworks = Framework.getInstance().noFrameworks
        before(async ()=> {
            Framework.getInstance().isExpressBased = () => {return false}
            Framework.getInstance().isPureExpress =  () => {return false}
            Framework.getInstance().noFrameworks = () => {return false}
            await server.start();
        })

        afterEach(() => {
            agentTestWrapper.stop()
        })

        after( ()=> {
            Framework.getInstance().isExpressBased = expressBased
            Framework.getInstance().isPureExpress = onlyExpress
            Framework.getInstance().isPureExpress = noFrameworks
            server.stop()
            agentTestWrapper.stop()
        })

        it('can capture spans', async () => {
            const response = await httpRequest.get('http://localhost:8000/')
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(3)
            let serverSpanAttributes = spans[1].attributes
            expect(serverSpanAttributes['http.method']).to.equal('GET')
            expect(serverSpanAttributes['net.host.name']).to.equal('localhost')
            expect(serverSpanAttributes['http.target']).to.equal('/')
            expect(serverSpanAttributes['net.transport']).to.equal('ip_tcp')
            expect(serverSpanAttributes['http.status_code']).to.equal(200)

            let requestSpanAttributes = spans[2].attributes
            expect(requestSpanAttributes['http.method']).to.equal('GET')
            expect(requestSpanAttributes['net.peer.name']).to.equal('localhost')
            expect(requestSpanAttributes['http.target']).to.equal('/')
            expect(requestSpanAttributes['net.transport']).to.equal('ip_tcp')
            expect(requestSpanAttributes['http.status_code']).to.equal(200)
            expect(spans[2].name).to.equal('HTTP GET')
        });

        it('can capture response body data', async () => {
            await httpRequest.post({headers: {"Content-Type": "application/json"},
                    host: 'localhost', port: 8000, path: '/test-post'},
                JSON.stringify({"test": "data"}))
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(3)
            let serverSpanAttributes = spans[1].attributes
            expect(serverSpanAttributes['http.response.body']).to.equal(`{"test":"post-data","number":1}`)

            let requestSpanAttributes = spans[2].attributes
            expect(requestSpanAttributes['http.response.body']).to.equal(`{"test":"post-data","number":1}`)
        });

        it('can capture request body data', async () => {
            await httpRequest.post({
                    host: 'localhost',
                    port: 8000,
                    path: '/test-post',
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                JSON.stringify({data: "123"})
            )
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(3)
            let serverSpanAttributes = spans[1].attributes
            expect(serverSpanAttributes['http.request.body']).to.equal(`{"data":"123"}`)

            let requestSpanAttributes = spans[2].attributes
            expect(requestSpanAttributes['http.request.body']).to.equal(`{"data":"123"}`)
        });

        it('can capture request & response headers', async () => {
            await httpRequest.post({
                    host: 'localhost',
                    port: 8000,
                    path: '/test-post',
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                JSON.stringify({data: "123"})
            )
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(3)
            let serverSpanAttributes = spans[1].attributes
            expect(serverSpanAttributes['http.request.header.content-type']).to.equal('application/json')
            expect(serverSpanAttributes['http.request.header.host']).to.equal('localhost:8000')
            expect(serverSpanAttributes['http.request.header.connection']).to.equal('close')

            expect(serverSpanAttributes['http.response.header.content-type']).to.equal('application/json; charset=utf-8')
            expect(serverSpanAttributes['http.response.header.x-test-header']).to.equal('some-value')
        });

        it('can capture status code', async () => {
            await httpRequest.post({
                    host: 'localhost',
                    port: 8000,
                    path: '/test-post',
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                JSON.stringify({data: "123"})
            )
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(3)
            let serverSpanAttributes = spans[1].attributes
            expect(serverSpanAttributes['http.status_code']).to.equal(200)
        });

        describe('filter api', () => {
            before(() => {
                Registry.getInstance().register(new SampleFilter())
            })

            after(() => {
                // @ts-ignore
                Registry.instance = undefined
            })

            it('will return a 403 if a header filter returns true', async() => {
                await httpRequest.post({
                        host: 'localhost',
                        port: 8000,
                        path: '/test-post',
                        headers: {
                            'Content-Type': "application/json",
                            'x-filter-test': "123"
                        }
                    },
                    JSON.stringify({"test": "req data"}))

                let spans = agentTestWrapper.getSpans()
                expect(spans.length).to.equal(2)
                let serverSpan = spans[0]
                expect(serverSpan.attributes['http.status_code']).to.equal(403)
                expect(serverSpan.attributes['http.status_text']).to.equal('FORBIDDEN')

                let requestSpan = spans[1]
                expect(requestSpan.attributes['http.status_code']).to.equal(403)
                expect(requestSpan.attributes['http.status_text']).to.equal('FORBIDDEN')
            })

            it('will return a 403 if a body filter returns true', async() => {
                await httpRequest.post({
                        host: 'localhost',
                        port: 8000,
                        path: '/test-post',
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

            it('will call the filter with ip attributes', async () => {
                class TestFilter implements IFilter {
                    evaluateBodyAndHeaders(span: Span, headers: any, body: string, requestType: REQUEST_TYPE): boolean {
                        // @ts-ignore
                        const attrs = span.attributes
                        expect(attrs['net.peer.ip']).to.exist
                        return false;
                    }

                    evaluateUrlAndHeaders(span: Span, url: string | undefined, headers: any, requestType: REQUEST_TYPE): boolean {
                        // @ts-ignore
                        const attrs = span.attributes
                        expect(attrs['net.peer.ip']).to.exist
                        return false;
                    }
                }
                Registry.getInstance().register(new TestFilter())
                await httpRequest.post({
                        host: 'localhost',
                        port: 8000,
                        path: '/test-post',
                        headers: {
                            'Content-Type': "application/json",
                        }
                    },
                    JSON.stringify({"test": "body-content"}))

                let spans = agentTestWrapper.getSpans()
                expect(spans.length).to.equal(3)
                let serverSpan = spans[1]
                expect(serverSpan.attributes['http.status_code']).to.equal(200)

                let requestSpan = spans[2]
                expect(requestSpan.attributes['http.status_code']).to.equal(200)
            })
        })


    });
//}
