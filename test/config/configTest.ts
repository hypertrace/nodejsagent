import {Config} from '../../src/config/config'
import { expect } from 'chai';
import {join} from "path";

describe('Config tests', () => {
    const env = Object.assign({}, process.env);

    after(() => {
        Config.reset()
        Config.getInstance()
        process.env = env;
    });

    it('checking default config', () => {
        Config.reset()
        const config = Config.getInstance()
        expect(config.config.service_name).to.equal('nodeagent')
        expect(config.config.enabled).to.equal(true)
        expect(config.config.propagation_formats).to.eql(['TRACECONTEXT'])

        expect(config.config.reporting.endpoint).to.equal('http://localhost:4317')
        expect(config.config.reporting.secure).to.equal(false)
        expect(config.config.reporting.trace_reporter_type).to.equal('OTLP')
        expect(config.config.reporting.cert_file).to.equal('')

        expect(config.config.data_capture.http_headers.request).to.equal(true)
        expect(config.config.data_capture.http_headers.response).to.equal(true)
        expect(config.config.data_capture.http_body.request).to.equal(true)
        expect(config.config.data_capture.http_body.response).to.equal(true)
        expect(config.config.data_capture.rpc_metadata.request).to.equal(true)
        expect(config.config.data_capture.rpc_metadata.response).to.equal(true)
        expect(config.config.data_capture.rpc_body.request).to.equal(true)
        expect(config.config.data_capture.rpc_body.response).to.equal(true)
        expect(config.config.data_capture.body_max_size_bytes).to.equal(131072)
        expect(config.config.data_capture.body_max_processing_size_bytes).to.equal(131072)

        expect(config.config.resource_attributes).to.eql({})
    });

    it('check loading file config', () => {
        let path = join(__dirname, 'config_file.yaml')
        process.env.HT_CONFIG_FILE=path

        Config.reset()
        const config = Config.getInstance()
        expect(config.config.service_name).to.equal('node_agent_001')
        expect(config.config.enabled).to.equal(false)
        expect(config.config.propagation_formats).to.eql(['B3'])

        expect(config.config.reporting.endpoint).to.equal('http://localhost:9411/api/v2/spans')
        expect(config.config.reporting.secure).to.equal(true)
        expect(config.config.reporting.trace_reporter_type).to.equal('ZIPKIN')
        expect(config.config.reporting.token).to.equal('TestToken')
        expect(config.config.reporting.cert_file).to.equal('./someRootCA.crt')

        expect(config.config.data_capture.http_headers.request).to.equal(false)
        expect(config.config.data_capture.http_headers.response).to.equal(false)
        expect(config.config.data_capture.http_body.request).to.equal(false)
        expect(config.config.data_capture.http_body.response).to.equal(false)
        expect(config.config.data_capture.rpc_metadata.request).to.equal(false)
        expect(config.config.data_capture.rpc_metadata.response).to.equal(false)
        expect(config.config.data_capture.rpc_body.request).to.equal(false)
        expect(config.config.data_capture.rpc_body.response).to.equal(false)
        expect(config.config.data_capture.body_max_size_bytes).to.equal(123457)
        expect(config.config.data_capture.body_max_processing_size_bytes).to.equal(567890)

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
        process.env.HT_DATA_CAPTURE_BODY_MAX_PROCESSING_SIZE_BYTES = '9123412'
        Config.reset()
        const config = Config.getInstance()
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
        expect(config.config.data_capture.body_max_processing_size_bytes).to.equal(9123412)

        delete process.env.HT_SERVICE_NAME
        delete process.env.HT_ENABLED
        delete process.env.HT_PROPAGATION_FORMATS

        delete process.env.HT_REPORTING_SECURE
        delete process.env.HT_REPORTING_ENDPOINT
        delete process.env.HT_REPORTING_TRACE_REPORTER_TYPE

        delete process.env.HT_DATA_CAPTURE_HTTP_HEADERS_REQUEST
        delete process.env.HT_DATA_CAPTURE_HTTP_HEADERS_RESPONSE
        delete process.env.HT_DATA_CAPTURE_HTTP_BODY_REQUEST
        delete process.env.HT_DATA_CAPTURE_HTTP_BODY_RESPONSE
        delete process.env.HT_DATA_CAPTURE_RPC_METADATA_REQUEST
        delete process.env.HT_DATA_CAPTURE_RPC_METADATA_RESPONSE
        delete process.env.HT_DATA_CAPTURE_RPC_BODY_REQUEST
        delete process.env.HT_DATA_CAPTURE_RPC_BODY_RESPONSE
        delete process.env.HT_DATA_CAPTURE_BODY_MAX_SIZE_BYTES
        delete process.env.HT_DATA_CAPTURE_BODY_MAX_PROCESSING_SIZE_BYTES
    });

});