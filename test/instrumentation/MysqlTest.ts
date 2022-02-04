import {FieldInfo, MysqlError} from "mysql";
import {AgentForTest} from "./AgentForTest";
import {expect} from "chai";
const agentTestWrapper = AgentForTest.getInstance();
agentTestWrapper.instrument()

// These tests depend on having a running mysql instance
// Ensure that you run: cd test/externalServices && docker-compose up
// before running this test

describe('Mysql2 test', async () => {

    afterEach(() => {
        agentTestWrapper.stop()
    })
    const mysql = require('mysql2');

    // create the connection to database
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'testhypertrace',
        database: 'hypertrace'
    });

    it('will capture a span for query', (done) => {
        connection.connect();

        connection.query('SELECT 1 + 1 AS solution', function (error: MysqlError | null, results: any, fields: FieldInfo[] | undefined) {
            if (error) throw error;
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(1)
            let spanAttrs = spans[0].attributes
            expect(spanAttrs['db.system']).to.equal("mysql")
            expect(spanAttrs['net.peer.name']).to.equal('localhost')
            expect(spanAttrs['net.peer.port']).to.equal(3306)
            expect(spanAttrs['db.name']).to.equal('hypertrace')
            expect(spanAttrs['db.user']).to.equal('root')
            expect(spanAttrs['db.statement']).to.equal('SELECT 1 + 1 AS solution')
            connection.end();
            done()
        });
    })
})

describe('Mysql test', () => {
    afterEach(() => {
        agentTestWrapper.stop()
    })
    const mysql = require('mysql');

    // create the connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'testhypertrace',
        database: 'hypertrace'
    });

    it('will capture a span for query', (done) => {
        connection.connect();

        connection.query('SELECT 1 + 1 AS solution', function (error: MysqlError | null, results: any, fields: FieldInfo[] | undefined) {
            if (error) throw error;
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(1)
            let spanAttrs = spans[0].attributes
            expect(spanAttrs['db.system']).to.equal("mysql")
            expect(spanAttrs['net.peer.name']).to.equal('localhost')
            expect(spanAttrs['net.peer.port']).to.eql(3306)
            expect(spanAttrs['db.name']).to.equal('hypertrace')
            expect(spanAttrs['db.user']).to.equal('root')
            expect(spanAttrs['db.statement']).to.equal('SELECT 1 + 1 AS solution')
            connection.end();
            done()
        });

    })
})