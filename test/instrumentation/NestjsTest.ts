import {AgentForTest} from "./AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import { NestFactory } from '@nestjs/core';
import {Body, INestApplication, Module, Post} from "@nestjs/common";
import { Controller, Get } from '@nestjs/common';
import {httpRequest} from "./HttpRequest";
import {expect} from "chai";

export class CreateString {
    data: string;
    constructor(data : string) {
        this.data = data
    }
}

@Controller()
class AppController {
    constructor() {}
    @Get('/test')
    getHello(): string {
        return "Some plain text content";
    }

    @Post('/test-post')
    postHello(@Body() createString: CreateString) : object {
        return {"msg": "success", "data": createString.data}
    }

}

@Module({
    imports: [],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}

// https://docs.nestjs.com/first-steps#prerequisites
if(!['v8', 'v10'].some((nodeVersion) => {process.version.startsWith(nodeVersion)})) {
    async function bootstrap() : Promise<INestApplication> {
        const app = await NestFactory.create(AppModule);
        await app.listen(3000);
        return app
    }
    describe('NestJS tests', () => {
        let appInstance : INestApplication

        before(async () => {
            appInstance = await bootstrap();
        })

        beforeEach(() => {
            agentTestWrapper.stop()
        })

        afterEach(() => {
            agentTestWrapper.stop()
        })

        after(() => {
            appInstance.close()
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
    });
}