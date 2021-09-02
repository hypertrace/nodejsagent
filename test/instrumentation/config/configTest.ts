import {Config} from '../../../src/instrumentation/config/config'
import { expect } from 'chai';
import {join} from "path";
import {hypertrace} from "../../../src/instrumentation/config/generated";
import {common} from "protobufjs";

describe('Config tests', () => {
    it('checking default config', () => {
        const config = new Config();
        expect(config.config.service_name).to.equal('nodeagent')
        expect(config.config.enabled).to.equal(true)
        expect(config.config.propagation_formats).to.eql(['TRACECONTEXT'])

        expect(config.config.reporting.endpoint).to.equal('http://localhost:4317')
        expect(config.config.reporting.secure).to.equal(false)
        expect(config.config.reporting.trace_reporter_type).to.equal('OTLP')

        expect(config.config.data_capture.http_headers.request).to.equal(true)
        expect(config.config.data_capture.http_headers.response).to.equal(true)
        expect(config.config.data_capture.http_body.request).to.equal(true)
        expect(config.config.data_capture.http_body.response).to.equal(true)
        expect(config.config.data_capture.rpc_metadata.request).to.equal(true)
        expect(config.config.data_capture.rpc_metadata.response).to.equal(true)
        expect(config.config.data_capture.rpc_body.request).to.equal(true)
        expect(config.config.data_capture.rpc_body.response).to.equal(true)
        expect(config.config.data_capture.body_max_size_bytes).to.equal(131072)

        expect(config.config.resource_attributes).to.eql({})
    });

    it('check loading file config', () => {
        let path = join(__dirname, 'config_file.yaml')
        process.env.HT_CONFIG_FILE=path

        const config = new Config();
        expect(config.config.service_name).to.equal('node_agent_001')
        expect(config.config.enabled).to.equal(false)
        expect(config.config.propagation_formats).to.eql(['B3'])

        expect(config.config.reporting.endpoint).to.equal('http://localhost:9411/api/v2/spans')
        expect(config.config.reporting.secure).to.equal(true)
        expect(config.config.reporting.trace_reporter_type).to.equal('ZIPKIN')
        expect(config.config.reporting.token).to.equal('TestToken')

        expect(config.config.data_capture.http_headers.request).to.equal(false)
        expect(config.config.data_capture.http_headers.response).to.equal(false)
        expect(config.config.data_capture.http_body.request).to.equal(false)
        expect(config.config.data_capture.http_body.response).to.equal(false)
        expect(config.config.data_capture.rpc_metadata.request).to.equal(false)
        expect(config.config.data_capture.rpc_metadata.response).to.equal(false)
        expect(config.config.data_capture.rpc_body.request).to.equal(false)
        expect(config.config.data_capture.rpc_body.response).to.equal(false)
        expect(config.config.data_capture.body_max_size_bytes).to.equal(123457)

        expect(config.config.resource_attributes).to.eql({tester01: "tester01"})
        delete process.env.HT_CONFIG_FILE
    });

    it('check loading env config', () => {
        process.env.HT_SERVICE_NAME = 'node_agent_env_001'
        process.env.HT_ENABLED = 'false'
        process.env.HT_PROPAGATION_FORMATS = 'B3,TRACECONTEXT'

        process.env.HT_REPORTING_SECURE = 'trUe'
        process.env.HT_REPORTING_ENDPOINT = 'http://localhost:9876/'
        process.env.HT_REPORTING_TRACE_REPORTER_TYPE = 'OTLP'

        process.env.HT_DATA_CAPTURE_HTTP_HEADERS_REQUEST = 'true'
        process.env.HT_DATA_CAPTURE_HTTP_HEADERS_RESPONSE = 'true'
        process.env.HT_DATA_CAPTURE_HTTP_BODY_REQUEST = 'true'
        process.env.HT_DATA_CAPTURE_HTTP_BODY_RESPONSE = 'false'
        process.env.HT_DATA_CAPTURE_RPC_METADATA_REQUEST = 'false'
        process.env.HT_DATA_CAPTURE_RPC_METADATA_RESPONSE = 'true'
        process.env.HT_DATA_CAPTURE_RPC_BODY_REQUEST = 'false'
        process.env.HT_DATA_CAPTURE_RPC_BODY_RESPONSE = 'false'
        process.env.HT_DATA_CAPTURE_BODY_MAX_SIZE_BYTES = '5432109'

        const config = new Config();
        expect(config.config.service_name).to.equal('node_agent_env_001')
        expect(config.config.enabled).to.equal(false)
        expect(config.config.propagation_formats).to.eql(['B3', 'TRACECONTEXT'])

        expect(config.config.reporting.endpoint).to.equal('http://localhost:9876/')
        expect(config.config.reporting.secure).to.equal(true)
        expect(config.config.reporting.trace_reporter_type).to.equal('OTLP')

        expect(config.config.data_capture.http_headers.request).to.equal(true)
        expect(config.config.data_capture.http_headers.response).to.equal(true)
        expect(config.config.data_capture.http_body.request).to.equal(true)
        expect(config.config.data_capture.http_body.response).to.equal(false)
        expect(config.config.data_capture.rpc_metadata.request).to.equal(false)
        expect(config.config.data_capture.rpc_metadata.response).to.equal(true)
        expect(config.config.data_capture.rpc_body.request).to.equal(false)
        expect(config.config.data_capture.rpc_body.response).to.equal(false)
        expect(config.config.data_capture.body_max_size_bytes).to.equal(5432109)
    });

});