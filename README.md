# Node.js Agent

`nodejsagent` provides a set of complementary instrumentation features for collecting relevant data to be processed by [Hypertrace](https://hypertrace.org).


## Development

### Developing locally

From the root of this project, run `tsc`.
Then run: `npm link @hypertrace/nodejsagent`

You can then run or debug the example application in the `examples` directory. 

### Updating protobuf definitions
If you want to update the protobuf definitions, first update the `agent-config` submodule.
ex: `git submodule update --init --recursive`

You can then run `npm run generate_pb`

This will generate two files: `./src/instrumentation/config/generated.js` & `./src/instrumentation/config.generated.d.ts`

### Tests
Tests should be added to the `test` directory, in a structure that matches that of the file you are attempting to test.

Ideally all functionality is testable in locally runnable unit-tests(as opposed to in a docker container), primarily for ease of debugging.

You can run all tests with `npm run test`
