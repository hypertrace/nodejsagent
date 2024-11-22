import {AgentForTest} from "./AgentForTest";
import {expect} from "chai";
import {LambdaRequestHook, LambdaResponseHook} from "../../src/instrumentation/LambdaInstrumentationWrapper";
import {error} from "loglevel";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

let apiGatewayEventV1 = {
    // "version": "1.0", version isn't always present so cant be relied on
    "resource": "/my/path",
    "path": "/my/path",
    "httpMethod": "PUT",
    "headers": {
        "header1": "value1",
        "header2": "value2",
        'x-forwarded-proto': 'https',
        'content-type': 'application/json',
    },
    "queryStringParameters": {
        "parameter1": "value1",
        "parameter2": "value"
    },
    "multiValueQueryStringParameters": {
        "parameter1": [
            "value1",
            "value2"
        ],
        "parameter2": [
            "value"
        ]
    },
    "requestContext": {
        "accountId": "123456789012",
        "apiId": "id",
        "authorizer": {
            "claims": null,
            "scopes": null
        },
        "domainName": "id.execute-api.us-east-1.amazonaws.com",
        "domainPrefix": "id",
        "extendedRequestId": "request-id",
        "httpMethod": "GET",
        "identity": {
            "accessKey": null,
            "accountId": null,
            "caller": null,
            "cognitoAuthenticationProvider": null,
            "cognitoAuthenticationType": null,
            "cognitoIdentityId": null,
            "cognitoIdentityPoolId": null,
            "principalOrgId": null,
            "sourceIp": "192.0.2.1",
            "user": null,
            "userAgent": "user-agent",
            "userArn": null,
            "clientCert": {
                "clientCertPem": "CERT_CONTENT",
                "subjectDN": "www.example.com",
                "issuerDN": "Example issuer",
                "serialNumber": "a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1",
                "validity": {
                    "notBefore": "May 28 12:30:02 2019 GMT",
                    "notAfter": "Aug  5 09:36:04 2021 GMT"
                }
            }
        },
        "path": "/my/path",
        "protocol": "HTTP/1.1",
        "requestId": "id=",
        "requestTime": "04/Mar/2020:19:15:17 +0000",
        "requestTimeEpoch": 1583349317135,
        "resourceId": null,
        "resourcePath": "/my/path",
        "stage": "$default"
    },
    "pathParameters": null,
    "stageVariables": null,
    "body": '{\n\t"req-body": "some-data"\n}',
    "isBase64Encoded": false
}

let response = {
    "statusCode": "200",
    "headers": {
        "a-Header": "some_VALUE",
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({"some_body_data": "response-data"})
}


describe('Lambda test', () => {

    let apiGatewayEventV2 = {
        // "version": "2.0", version isn't always present so cant be relied on
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

    beforeEach(() => {
        agentTestWrapper.stop()
    })

    afterEach( ()=> {
        agentTestWrapper.stop()
    })


    it('can capture request data from api gateway event', () => {
        let event = apiGatewayEventV2
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

    it('apigateway v1 - can capture request data from api gateway event', () => {
        let event = apiGatewayEventV1
        let tracer = agentTestWrapper._provider.getTracer("@hypertrace/nodejsagent")
        let span = tracer.startSpan("lambda-span")
        LambdaRequestHook(span, {event, context})
        span.end()
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(1)
        let lambdaSpan = spans[0]
        expect(lambdaSpan.attributes['http.method']).to.equal('PUT')
        expect(lambdaSpan.attributes['http.scheme']).to.equal('https')
        expect(lambdaSpan.attributes['http.host']).to.equal('id.execute-api.us-east-1.amazonaws.com')
        expect(lambdaSpan.attributes['http.target']).to.equal('/my/path')
        expect(lambdaSpan.attributes['http.request.header.content-type']).to.equal('application/json')
        expect(lambdaSpan.attributes['http.request.header.header1']).to.equal('value1')
        expect(lambdaSpan.attributes['http.request.body']).to.equal('{\n' +
            '\t"req-body": "some-data"\n' +
            '}')
    })

    it('apigateway v1 - can capture response data from returned lambda map', () => {
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

describe("manually instrument lambda function", () => {
    beforeEach(() => {
        agentTestWrapper.stop()
    })

    afterEach( ()=> {
        agentTestWrapper.stop()
    })
    it('can be manually instrumented', async () => {
        async function myHandler(event, context, callback){
            return response
        }

        let wrappedHandler = agentTestWrapper.instrumentLambda(myHandler)
        await wrappedHandler(apiGatewayEventV1, {}, () => {})

        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(1)
        let lambdaSpan = spans[0]
        expect(lambdaSpan.attributes['http.method']).to.equal('PUT')
        expect(lambdaSpan.attributes['http.scheme']).to.equal('https')
        expect(lambdaSpan.attributes['http.host']).to.equal('id.execute-api.us-east-1.amazonaws.com')
        expect(lambdaSpan.attributes['http.target']).to.equal('/my/path')
        expect(lambdaSpan.attributes['http.request.header.content-type']).to.equal('application/json')
        expect(lambdaSpan.attributes['http.request.header.header1']).to.equal('value1')
        expect(lambdaSpan.attributes['http.request.body']).to.equal('{\n' +
            '\t"req-body": "some-data"\n' +
            '}')
        expect(lambdaSpan.attributes['http.status_code']).to.equal('200')
        expect(lambdaSpan.attributes['http.response.header.a-header']).to.equal('some_VALUE')
        expect(lambdaSpan.attributes['http.response.header.content-type']).to.equal('application/json')
        expect(lambdaSpan.attributes['http.response.body']).to.equal('{"some_body_data":"response-data"}')
    })

    it('can be manually instrumented and handle error', async () => {
        async function myHandler(event, context, callback){
            throw new Error("some error")
        }

        let wrappedHandler = agentTestWrapper.instrumentLambda(myHandler)
        try {
            await wrappedHandler(apiGatewayEventV1, {}, () => {})
        } catch(_){}


        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(1)
        let lambdaSpan = spans[0]
        expect(lambdaSpan.attributes['http.method']).to.equal('PUT')
        expect(lambdaSpan.attributes['http.scheme']).to.equal('https')
        expect(lambdaSpan.attributes['http.host']).to.equal('id.execute-api.us-east-1.amazonaws.com')
        expect(lambdaSpan.attributes['http.target']).to.equal('/my/path')
        expect(lambdaSpan.attributes['http.request.header.content-type']).to.equal('application/json')
        expect(lambdaSpan.attributes['http.request.header.header1']).to.equal('value1')
        expect(lambdaSpan.attributes['http.request.body']).to.equal('{\n' +
            '\t"req-body": "some-data"\n' +
            '}')
    })

    it('can handle non-apigateway events gracefully', async () => {
        async function myHandler(event, context, callback){
            return {"foo": "bar"}
        }

        let wrappedHandler = agentTestWrapper.instrumentLambda(myHandler)
        let errorCount = 0
        try {
            await wrappedHandler({"some-different-event": "foo"}, {}, () => {})
        } catch(error){
            errorCount += 1
        }
        expect(errorCount).to.equal(0)
    })

    it('can handle non-apigateway events without a response gracefully', async () => {
        async function myHandler(event, context, callback){
        }

        let wrappedHandler = agentTestWrapper.instrumentLambda(myHandler)
        let errorCount = 0
        try {
            await wrappedHandler({"some-different-event": "foo"}, {}, () => {})
        } catch(error){
            errorCount += 1
        }
        expect(errorCount).to.equal(0)
    })
})
