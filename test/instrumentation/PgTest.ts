import {FieldInfo, MysqlError} from "mysql";
import {AgentForTest} from "./AgentForTest";
import {expect} from "chai";
import {Client, Pool, QueryResult} from "pg";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

// These tests depend on having a running mysql instance
// Ensure that you run: cd test/externalServices && docker-compose up
// before running this test
describe('PG test', () => {
    afterEach(() => {
        agentTestWrapper.stop()
    })

    const { Pool, Client } = require('pg')
    it('will capture a span for pool query', (done) => {
        const pool = new Pool({
            user: 'hypertrace',
            host: 'localhost',
            database: 'hypertrace',
            password: 'hypertrace',
            port: 5432,
        })

        pool.query('SELECT NOW()', (err: Error, res: QueryResult<any>) => {
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(2)
            for(let span of spans) {
                let spanAttrs = span.attributes
                expect(spanAttrs["db.name"]).to.equal("hypertrace")
                expect(spanAttrs["db.system"]).to.equal("postgresql")
                expect(spanAttrs["db.user"]).to.equal("hypertrace")
                expect(spanAttrs["net.peer.port"]).to.equal(5432)
            }

            let querySpan = spans[1]
            let queryAttrs = querySpan.attributes;
            expect(queryAttrs["db.statement"]).to.equal("SELECT NOW()")
            pool.end()
            done()
        })
    })

    it('will capture spans for client query', (done) => {
        const client = new Client({
            user: 'hypertrace',
            host: 'localhost',
            database: 'hypertrace',
            password: 'hypertrace',
            port: 5432,
        })
        client.connect()
        client.query('SELECT NOW()', (err: Error, res: QueryResult<any>) => {
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(1)
            let spanAttrs = spans[0].attributes
            expect(spanAttrs["db.name"]).to.equal("hypertrace")
            expect(spanAttrs["db.system"]).to.equal("postgresql")
            expect(spanAttrs["db.user"]).to.equal("hypertrace")
            expect(spanAttrs["net.peer.port"]).to.equal(5432)
            expect(spanAttrs["db.statement"]).to.equal("SELECT NOW()")
            client.end()
            done()
        })
    })
})
