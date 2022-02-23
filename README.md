# Node.js Agent
[![codecov](https://codecov.io/gh/hypertrace/nodejsagent/branch/main/graph/badge.svg?token=Y4ZH7D6LE3)](https://codecov.io/gh/hypertrace/nodejsagent)

`nodejsagent` provides a set of complementary instrumentation features for collecting relevant data to be processed by [Hypertrace](https://hypertrace.org).


## Development

### Developing locally
Then run: `npm run build`, you can then install the generated .tgz as a normal dependency.

_Note: Using npm link doesnt solve the local testing problem as it will use the hypertrace package dev-dependencies during instrumentation instead of the targetted node app_

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

### Building lambda layer
To build the layer & upload it to an AWS account:

1.) Run `npm install && npm run build`

2.) Run `./build_layer.sh <REGION>` where region is the region you want the layer to be available in

3.) Add an environment variable to your lambda: `AWS_LAMBDA_EXEC_WRAPPER=/opt/hypertrace-instrument`

4.) Configure reporting to a collector, you can set `HT_REPORTING_ENDPOINT` to a valid OTLP collector address. - If using with a collector layer, no need to specify an OTLP address as it will export to localhost:4317
