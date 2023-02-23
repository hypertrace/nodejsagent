import {AgentForTest} from "../AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import {expect} from "chai";
import {server} from './server'
import * as grpc from '@grpc/grpc-js';
import {ProtoGrpcType} from "@grpc/grpc-js/build/src/generated/channelz";
import {Registry} from "../../../src/filter/Registry";
import {SampleFilter} from "../SampleFilter";
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(`${__dirname}/notes.proto`);

const proto = (grpc.loadPackageDefinition(
    packageDefinition
) as unknown) as ProtoGrpcType;

// @ts-ignore
const client = new proto.NoteService('localhost:50051', grpc.credentials.createInsecure())

describe('Grpc JS Support', () => {
    before((done)=> {
        server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
            console.log('server listening')
            server.start()
            done()
        })

    })

    afterEach( ()=> {
        agentTestWrapper.stop()
    })

    after(()=> {
        server.forceShutdown();
    })

    describe('data capture', () => {
        // we need to make the grpc call before the actual test because the client wrapper doesnt
        // end the span until after the callback function returns
        beforeEach((done) =>  {
            let metadata = new grpc.Metadata();
            metadata.add('some-metadata-key', 'some-metadata-value');
            client.List({}, metadata, (err, notes) => {
                if (err) throw err
                console.log(notes)
                done()
            })
        })
        it('can collect grpc metadata',  () => {
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(2)

            let serverSpan = spans[0]
            let ssAttributes = serverSpan.attributes
            expect(ssAttributes['rpc.request.metadata.some-metadata-key']).to.equal('some-metadata-value')
            expect(ssAttributes['rpc.request.metadata.user-agent']).to.equal('grpc-node-js/1.5.4')
            expect(ssAttributes['rpc.response.metadata.some-metadata-key-from-server']).to.equal('some-metadata-server-value')
            expect(serverSpan.name).to.equal('grpc.NoteService/List')

            let clientSpan = spans[1]
            let csAttributes = clientSpan.attributes
            expect(csAttributes['rpc.request.metadata.some-metadata-key']).to.equal('some-metadata-value')
            expect(csAttributes['rpc.response.metadata.some-metadata-key-from-server']).to.equal('some-metadata-server-value')
            expect(csAttributes['grpc.method']).to.equal('/NoteService/List')
            expect(clientSpan.name).to.equal('grpc.NoteService/List')
        })

        it('can collect grpc body data', () => {
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(2)

            let ssAttributes = spans[0].attributes
            expect(ssAttributes['rpc.request.body']).to.equal("{}")
            expect(ssAttributes['rpc.response.body']).to.equal('{"notes":[{"id":"1","title":"Note 1","description":"Content 1"},{"id":"2","title":"Note 2","description":"Content 2"}]}')

            let csAttributes = spans[1].attributes
            expect(csAttributes['rpc.request.body']).to.equal("{}")
            expect(csAttributes['rpc.response.body']).to.equal('{"notes":[{"id":"1","title":"Note 1","description":"Content 1"},{"id":"2","title":"Note 2","description":"Content 2"}]}')
        })

        it('can collect grpc status code',  () => {
            let spans = agentTestWrapper.getSpans()
            expect(spans.length).to.equal(2)

            let ssAttributes = spans[0].attributes
            expect(ssAttributes['rpc.grpc.status_code']).to.equal(0)

            let csAttributes = spans[1].attributes
            expect(csAttributes['rpc.grpc.status_code']).to.equal(0)
        })
    })

    describe('filter api', () => {
        before(() => {
            Registry.getInstance().register(new SampleFilter())
        })

        after(() => {
            // @ts-ignore
            Registry.instance = undefined
        })

        describe('filtered metadata', () => {
            // we need to make the grpc call before the actual test because the client wrapper doesnt
            // end the span until after the callback function returns
            beforeEach((done) =>  {
                let metadata = new grpc.Metadata();
                metadata.add('x-filter-test', 'some-metadata-value');
                client.List({}, metadata, (err, notes) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(notes)
                    done()
                })
            })

            it('can block request based on grpc metadata',  () => {
                let spans = agentTestWrapper.getSpans()
                expect(spans.length).to.equal(2)

                let ssAttributes = spans[0].attributes
                expect(ssAttributes['rpc.grpc.status_code']).to.equal("7")

                let csAttributes = spans[1].attributes
                expect(csAttributes['rpc.grpc.status_code']).to.equal("7")
            })
        })

        describe('filtered body', () => {
            // we need to make the grpc call before the actual test because the client wrapper doesnt
            // end the span until after the callback function returns
            beforeEach((done) =>  {
                let metadata = new grpc.Metadata();
                client.Find( {id: "block-this-body"}, metadata, (err, note) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(note)
                    done()
                })
            })

            it('can block request based on grpc body',  () => {
                let spans = agentTestWrapper.getSpans()
                expect(spans.length).to.equal(2)

                let ssAttributes = spans[0].attributes
                expect(ssAttributes['rpc.grpc.status_code']).to.equal("7")

                let csAttributes = spans[1].attributes
                expect(csAttributes['rpc.grpc.status_code']).to.equal("7")
            })
        })
    })
});
