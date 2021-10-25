import {AgentForTest} from "../AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()
import {expect} from "chai";
import {httpRequest} from "../HttpRequest";
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
});
