import {AgentForTest} from "./AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import {NestFactory} from '@nestjs/core';
import {Body, INestApplication, Module, Post} from "@nestjs/common";
import {Controller, Get} from '@nestjs/common';
import {httpRequest} from "./HttpRequest";
import {expect} from "chai";
import {Registry} from "../../src/filter/Registry";
import {SampleFilter} from "./SampleFilter";
import semver = require("semver/preload");

export class CreateString {
    data: string;

    constructor(data: string) {
        this.data = data
    }
}

@Controller()
class AppController {
    constructor() {
    }

    @Get('/test')
    getHello(): string {
        return "Some plain text content";
    }

    @Post('/test-post')
    postHello(@Body() createString: CreateString): object {
        return {"msg": "success", "data": createString.data}
    }

}

@Module({
    imports: [],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}

// https://docs.nestjs.com/first-steps#prerequisites
async function bootstrap(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    return app
}

describe('NestJS tests', () => {
    let appInstance: INestApplication

    before(async function () {
        const currentNodeVersion = process.version;
        if (semver.lt(currentNodeVersion, '18.0.0')) {
            // @ts-ignore
            this.skip();
        }
        appInstance = await bootstrap();
    })

    beforeEach(() => {
        agentTestWrapper.stop()
    })

    afterEach(() => {
        agentTestWrapper.stop()
    })

    after(() => {
        if(appInstance){
            appInstance.close()
        }

    })

    it('can capture request & response attributes', async () => {
        let headers = {
            "some-header": "a-value",
            "Another_Header": "another_value"
        }
        await httpRequest.get({headers: headers, host: 'localhost', port: 3000, path: '/test'})
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)
        let requestSpanAttributes = spans[1].attributes
        expect(requestSpanAttributes['http.request.header.another_header']).to.equal('another_value')
        expect(requestSpanAttributes['http.request.header.some-header']).to.equal('a-value')
        expect(requestSpanAttributes['http.response.header.content-type']).to.equal('text/html; charset=utf-8')

        let serverSpanAttributes = spans[0].attributes
        expect(serverSpanAttributes['http.request.header.some-header']).to.equal('a-value')
        expect(serverSpanAttributes['http.request.header.another_header']).to.equal('another_value')
        expect(spans[0].name).to.equal('GET /test')
    });

    it('can capture request & response bodies', async () => {
        let headers = {
            "some-header": "a-value",
            "Another_Header": "another_value",
            "Content-Type": "application/json"
        }
        await httpRequest.post({headers: headers, host: 'localhost', port: 3000, path: '/test-post'},
            JSON.stringify({"data": "some_data"}))
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(2)

        let serverSpan = spans[0].attributes
        expect(serverSpan['http.request.body']).to.equal("{\"data\":\"some_data\"}")
        expect(serverSpan['http.response.body']).to.equal("{\"msg\":\"success\",\"data\":\"some_data\"}")

        let requestSpan = spans[1]
        expect(requestSpan.attributes['http.request.body']).to.eql("{\"data\":\"some_data\"}")
        expect(requestSpan.attributes['http.response.body']).to.eql("{\"msg\":\"success\",\"data\":\"some_data\"}")
    });

    describe('filter api', () => {
        before(function () {
            const currentNodeVersion = process.version;
            if (semver.lt(currentNodeVersion, '18.0.0')) {
                // @ts-ignore
                this.skip();
            }
            Registry.getInstance().register(new SampleFilter())
        })

        after(() => {
            // @ts-ignore
            const currentNodeVersion = process.version;
            if (semver.gt(currentNodeVersion, '18.0.0')) {
                // @ts-ignore
                Registry.instance = undefined
            }

        })

        it('will return a 403 if a body filter returns true', async () => {
            await httpRequest.post({
                    host: 'localhost',
                    port: 3000,
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

        it('will return a 403 if a header filter returns true', async () => {
            await httpRequest.post({
                    host: 'localhost',
                    port: 3000,
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
            expect(serverSpan.attributes["net.peer.ip"]).to.exist
            expect(serverSpan.attributes['http.status_code']).to.equal(403)
            expect(serverSpan.attributes['http.status_text']).to.equal('FORBIDDEN')

            let requestSpan = spans[1]
            expect(requestSpan.attributes['http.status_code']).to.equal(403)
            expect(requestSpan.attributes['http.status_text']).to.equal('FORBIDDEN')
        })
    })
});