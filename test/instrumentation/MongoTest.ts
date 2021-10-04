import {AgentForTest} from "./AgentForTest";
import {expect} from "chai";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()
import * as mongodb from 'mongodb';
import {trace, context} from "@opentelemetry/api";

describe('Mongo test', () => {
    afterEach(() => {
        agentTestWrapper.stop()
    })

    it('will capture a span for pool query', (done) => {
        const url = 'mongodb://hypertrace:hypertrace@localhost:27017';
        const client = new mongodb.MongoClient(url);
        const span = trace.getTracer('default').startSpan('insertRootSpan');
        context.with(trace.setSpan(context.active(), span), async () => {
            const dbName = 'testMongo';

            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('documents');
            await collection.insertMany([
                {a: 1}, {a: 2}, {a: 3}
            ])

            let spans = agentTestWrapper.getSpans();
            expect(spans.length).to.equal(1);
            let spanAttrs = spans[0].attributes
            expect(spanAttrs['db.system']).to.equal("mongodb")
            expect(spanAttrs['db.name']).to.equal("testMongo")
            expect(spanAttrs["db.mongodb.collection"]).to.equal("documents")
            expect(spanAttrs["db.statement"]).to.equal("{\"a\":\"?\",\"_id\":\"?\"}")
            expect(spans[0].name).to.equal("mongodb.insert")

            done()
        });
    })
})