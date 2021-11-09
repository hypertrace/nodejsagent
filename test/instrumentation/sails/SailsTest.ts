import {AgentForTest} from "../AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()
import {expect} from "chai";
import {httpRequest} from "../HttpRequest";
import {Registry} from "../../../src/filter/Registry";
import {SampleFilter} from "../SampleFilter";
var sailsApp = require('./app')

describe('sails tests', () => {

    before((done) => {
        sailsApp.startSails(done)
    })

    beforeEach(() => {
        agentTestWrapper.stop()
    })

    afterEach(() => {
        agentTestWrapper.stop()
    })

    after(() => {
        sailsApp.stopSails()
    })

    it('can capture sails span attrs', async () => {
        await httpRequest.get({
                host: 'localhost',
                port: 1337,
                path: '/test-get'
            }
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(3)

        let serverSpan = spans[1]
        expect(serverSpan.name).to.equal('GET /test-get')
        expect(serverSpan.attributes['http.response.body']).to.equal("{\n" +
            "  \"msg\": \"success\"\n" +
            "}")
        expect(serverSpan.attributes['http.response.header.x-powered-by']).to.equal('Sails <sailsjs.com>')

        let requestSpan = spans[2]
        expect(requestSpan.name).to.equal('HTTP GET')
        expect(requestSpan.attributes['http.request.header.host']).to.equal('localhost:1337')
    });

    it('can capture sails request / response attrs', async () => {
        let headers = {
            'content-type': 'application/json'
        }
        await httpRequest.post({
                host: 'localhost',
                port: 1337,
                path: '/test-post',
                headers: headers
            },
            JSON.stringify({data: "123"})
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(3)

        let serverSpan = spans[1]
        expect(serverSpan.name).to.equal('POST /test-post')
        expect(serverSpan.attributes['http.response.body']).to.equal("{\n  \"msg\": \"post success\",\n  \"data\": \"123\"\n}")
        expect(serverSpan.attributes['http.response.header.x-powered-by']).to.equal('Sails <sailsjs.com>')
        expect(serverSpan.attributes['http.request.body']).to.equal("{\"data\":\"123\"}")

        let requestSpan = spans[2]
        expect(requestSpan.name).to.equal('HTTP POST')
        expect(requestSpan.attributes['http.request.header.host']).to.equal('localhost:1337')
        expect(requestSpan.attributes['http.response.body']).to.equal("{\n  \"msg\": \"post success\",\n  \"data\": \"123\"\n}")
        expect(requestSpan.attributes['http.request.body']).to.equal("{\"data\":\"123\"}")
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
            expect(serverSpan.attributes['http.status_text']).to.equal('PERMISSION DENIED')

            let requestSpan = spans[1]
            expect(requestSpan.attributes['http.status_code']).to.equal(403)
            expect(requestSpan.attributes['http.status_text']).to.equal('PERMISSION DENIED')
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
    })
});
