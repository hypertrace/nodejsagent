# Node.js Agent
[![codecov](https://codecov.io/gh/hypertrace/nodejsagent/branch/main/graph/badge.svg?token=Y4ZH7D6LE3)](https://codecov.io/gh/hypertrace/nodejsagent)

`nodejsagent` provides a set of complementary instrumentation features for collecting relevant data to be processed by [Hypertrace](https://hypertrace.org).


## Development

### Building
1.  Update protobuf definitions
    1. Update the `agent-config` submodule.
        ```
        git submodule update --init --recursive
        ```
    1. Generate protobbuf files: `./src/instrumentation/config/generated.js` and  `./src/instrumentation/config.generated.d.ts`.
        ```
        npm run generate_pb
        ```
1. Build.
    ```
    npm run build
    ```

You can then install the generated .tgz as a normal dependency.

_Note: Using npm link doesnt solve the local testing problem as it will use the hypertrace package dev-dependencies during instrumentation instead of the targetted node app_



### Testing
* Run the example application

    1. 
        ```
        cd ./examples/correlation
        ```
    1. Update `config.yaml` if needed.
    1. Install dependencies
        ```
        npm install
        ```
    1. Start application
        ```
        npm start
        ```

* Unit tests
    1. Start external services
        ```
        cd ./test/externalServices
        docker-compose up -d
        cd -
        ```
    1. 
        ```
        npm run test
        ```
    1. Stop external services if not needed.
        ```
        cd ./test/externalServices
        docker-compose down
        cd -
        ```

    Tests should be added to the `test` directory, in a structure that matches that of the file you are attempting to test.

    Ideally all functionality is testable in locally runnable unit-tests(as opposed to in a docker container), primarily for ease of debugging.

### Lambda layer
To build the layer & upload it to an AWS account:

1. Build using the steps above.
1. Run `./build_layer.sh <REGION>` where region is the region you want the layer to be available in
1. Add an environment variable to your lambda: `AWS_LAMBDA_EXEC_WRAPPER=/opt/hypertrace-instrument`
1. Configure reporting to a collector, you can set `HT_REPORTING_ENDPOINT` to a valid OTLP collector address. - If using with a collector layer, no need to specify an OTLP address as it will export to localhost:4317
