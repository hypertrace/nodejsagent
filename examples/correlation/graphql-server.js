globalThis = global;
const HypertraceAgent = require('@hypertrace/nodejsagent');
const hypertraceAgent = new HypertraceAgent()
hypertraceAgent.instrument()

const {ApolloServer, gql} = require('apollo-server');
const books = [
    {
        title: 'Learning to Read',
        author: 'An Author',
    },
    {
        title: 'Reading to Learn',
        author: 'Another Author',
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
server.listen()