import {AgentForTest} from "./AgentForTest";
import {expect} from "chai";
import {LambdaRequestHook, LambdaResponseHook} from "../../src/instrumentation/LambdaInstrumentationWrapper";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

describe('Lambda test', () => {
    let event = {
        headers: {
            accept: '*/*',
            'content-length': '28',
            'content-type': 'application/json',
            host: 'something.foo.bar',
            'user-agent': 'insomnia/2021.7.2',
            'x-amzn-trace-id': 'Root=1-6202ed56-7f8fd46116e4d65d4480d909',
            'x-forwarded-for': '202.87.208.0, 97.100.103.103',
            'x-forwarded-port': '443',
            'x-forwarded-proto': 'https'
        },
        cookies: ['a=b','foo=bar'],
        requestContext: {
            accountId: '286278240186',
            apiId: 'slmfg8swx6',
            domainName: 'something.foo.bar',
            domainPrefix: 'slmfg8swx6',
            http: {
                method: 'PUT',
                path: '/default/nodejs-test',
                protocol: 'HTTP/1.1',
                sourceIp: ' 97.100.103.103',
                userAgent: 'insomnia/2021.7.2'
            },
            requestId: 'NPoFkg6cIAMESMw=',
            routeKey: 'ANY /nodejs-test',
            stage: 'default',
            time: '08/Feb/2022:22:23:18 +0000',
            timeEpoch: 1644358998639
        },
        body: '{\n\t"req-body": "some-data"\n}',
        isBase64Encoded: false
    }
    let response = {
        "statusCode": "200",
        "headers": {
            "a-Header": "some_VALUE",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({"some_body_data": "response-data"})
    }

    beforeEach(() => {
        agentTestWrapper.stop()
    })

    afterEach( ()=> {
        agentTestWrapper.stop()
    })


    it('can capture request data from api gateway event', () => {
        let tracer = agentTestWrapper._provider.getTracer("@hypertrace/nodejsagent")
        let span = tracer.startSpan("lambda-span")
        LambdaRequestHook(span, {event, context})
        span.end()
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(1)
        let lambdaSpan = spans[0]
        expect(lambdaSpan.attributes['http.method']).to.equal('PUT')
        expect(lambdaSpan.attributes['http.scheme']).to.equal('https')
        expect(lambdaSpan.attributes['http.host']).to.equal('something.foo.bar')
        expect(lambdaSpan.attributes['http.target']).to.equal('/default/nodejs-test')
        expect(lambdaSpan.attributes['http.request.header.content-type']).to.equal('application/json')
        expect(lambdaSpan.attributes['http.request.header.user-agent']).to.equal('insomnia/2021.7.2')
        expect(lambdaSpan.attributes['http.request.header.cookie']).to.equal('a=b;foo=bar')
        expect(lambdaSpan.attributes['http.request.body']).to.equal('{\n' +
            '\t"req-body": "some-data"\n' +
            '}')
    })

    it('can capture response data from returned lambda map', () => {
        let tracer = agentTestWrapper._provider.getTracer("@hypertrace/nodejsagent")
        let span = tracer.startSpan("lambda-span")
        LambdaResponseHook(span, {err: undefined, res: response})
        span.end()
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(1)
        let lambdaSpan = spans[0]
        expect(lambdaSpan.attributes['http.status_code']).to.equal('200')
        expect(lambdaSpan.attributes['http.response.header.a-header']).to.equal('some_VALUE')
        expect(lambdaSpan.attributes['http.response.header.content-type']).to.equal('application/json')
        expect(lambdaSpan.attributes['http.response.body']).to.equal('{"some_body_data":"response-data"}')
    })
})
