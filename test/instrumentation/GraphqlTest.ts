import {AgentForTest} from "./AgentForTest";

const agentTestWrapper = AgentForTest.getInstance()
agentTestWrapper.instrument()

import {expect} from "chai";
import {httpRequest} from "./HttpRequest";
import { sha256 } from 'crypto-hash';

describe('Graphql Apollo tests', () => {
    const {ApolloServer, gql} = require('apollo-server');
    const books = [
        {
            title: 'The Awakening',
            author: 'Kate Chopin',
        },
        {
            title: 'City of Glass',
            author: 'Paul Auster',
        },
    ];

    const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
    const resolvers = {
        Query: {
            books: () => books,
        },
    };

    const server = new ApolloServer({ typeDefs, resolvers });
    before( (done) => {
        //agentTestWrapper.stop() // need to reset memory exporter because defining graphql scheme creates some spans
        server.listen().then(() => {
            console.log("server started")
            done()
        })
    })

    beforeEach(() => {
        agentTestWrapper.stop()
    })

    after(async () => {
        await server.stop()
    })

    it('can capture graphql span attrs', async () => {
        let headers = {
            "content-type": "application/json"
        }
        await httpRequest.post({
            headers: headers,
            host: 'localhost',
            port: 4000,
            path: '/graphql'
            },
            JSON.stringify({"query":"query { __typename }"})
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(6)

        let graphqlParseSpan = spans[1]
        expect(graphqlParseSpan.name).to.equal('graphql.parse')
        expect(graphqlParseSpan.attributes['graphql.source']).to.equal('query { __typename }')

        let graphqlValidateSpan = spans[2]
        expect(graphqlValidateSpan.name).to.equal('graphql.validate')

        let graphqlExecuteSpan = spans[3]
        expect(graphqlExecuteSpan.name).to.equal('graphql.execute')
        expect(graphqlExecuteSpan.attributes['graphql.operation.name']).to.equal('query')
        expect(graphqlExecuteSpan.attributes['graphql.source']).to.equal('query { __typename }')
    });

    it('can capture apollo persisted query span attrs', async () => {
        const query = '{books {title author}}'
        const sha256QueryHash = await sha256(query)
        console.log(sha256QueryHash)
        let headers = {
            "content-type": "application/json"
        }
        let alreadyPersistedBody = {
            "persistedQuery": {
                "version": 1,
                sha256Hash: sha256QueryHash
            }
        }
        let notPersistedYetBody = Object.assign({}, alreadyPersistedBody)
        let notPersistedPath = encodeURI(`/graphql?query=${query}&extensions=${JSON.stringify(notPersistedYetBody)}`)
        let persistedPath = encodeURI(`/graphql?&extensions=${JSON.stringify(alreadyPersistedBody)}`)
        // first send the request with the query + sha in order to persist the query
        // then send a request with just the sha to check the persisted query
        await httpRequest.get({
                headers: headers,
                host: 'localhost',
                port: 4000,
                path: notPersistedPath
            }
        )
        let spans = agentTestWrapper.getSpans()
        expect(spans.length).to.equal(7)
        let graphqlParseSpan = spans[1]
        expect(graphqlParseSpan.name).to.equal('graphql.parse')
        expect(graphqlParseSpan.attributes['graphql.source']).to.equal('{books {title author}}')

        let graphqlValidateSpan = spans[2]
        expect(graphqlValidateSpan.name).to.equal('graphql.validate')

        let graphqlExecuteSpan = spans[3]
        expect(graphqlExecuteSpan.name).to.equal('graphql.execute')
        expect(graphqlExecuteSpan.attributes['graphql.operation.name']).to.equal('query')
        expect(graphqlExecuteSpan.attributes['graphql.source']).to.equal('{books {title author}}')

        let resolveSpan = spans[4]
        expect(resolveSpan.name).to.equal('graphql.resolve')
        expect(resolveSpan.attributes['graphql.field.name']).to.equal('books')
        expect(resolveSpan.attributes['graphql.field.type']).to.equal('[Book]')
        expect(resolveSpan.attributes['graphql.source']).to.equal('books {title author}')

        // drain spans
        agentTestWrapper.stop()

        await httpRequest.get({
                headers: headers,
                host: 'localhost',
                port: 4000,
                path: persistedPath
            }
        )

        expect(spans.length).to.equal(7)
        graphqlParseSpan = spans[1]
        expect(graphqlParseSpan.name).to.equal('graphql.parse')
        // the important part here is we are recording the actual query as the graphql.source
        // instead of the sha256 of the query
        expect(graphqlParseSpan.attributes['graphql.source']).to.equal('{books {title author}}')

        graphqlValidateSpan = spans[2]
        expect(graphqlValidateSpan.name).to.equal('graphql.validate')

        graphqlExecuteSpan = spans[3]
        expect(graphqlExecuteSpan.name).to.equal('graphql.execute')
        expect(graphqlExecuteSpan.attributes['graphql.operation.name']).to.equal('query')
        expect(graphqlExecuteSpan.attributes['graphql.source']).to.equal('{books {title author}}')

        resolveSpan = spans[4]
        expect(resolveSpan.name).to.equal('graphql.resolve')
        expect(resolveSpan.attributes['graphql.field.name']).to.equal('books')
        expect(resolveSpan.attributes['graphql.field.type']).to.equal('[Book]')
        expect(resolveSpan.attributes['graphql.source']).to.equal('books {title author}')
    })
});