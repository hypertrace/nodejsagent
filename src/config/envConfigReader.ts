// '''Environment config loader'''
import {getEnvValue} from "./envSettings";


export function loadFromEnv(): object{
    let envConfig : any = {}

    let enabled = getEnvValue('ENABLED')
    if(enabled) {
        envConfig['enabled'] = isTrue(<string>enabled)
    }

    let serviceName = getEnvValue('SERVICE_NAME')
    if(serviceName) {
        envConfig['service_name'] = serviceName
    }

    let reportingEndpoint = getEnvValue('REPORTING_ENDPOINT')
    let reporting: any = {}
    if(reportingEndpoint) {
        reporting['endpoint'] = reportingEndpoint
    }

    let traceReporterType = getEnvValue('REPORTING_TRACE_REPORTER_TYPE')
    if(traceReporterType) {
        reporting['trace_reporter_type'] = traceReporterType
    }

    let reportingSecure = getEnvValue('REPORTING_SECURE')
    if(reportingSecure){
        reporting['secure'] = isTrue(<string>reportingSecure)
    }

    let reportingToken = getEnvValue('REPORTING_TOKEN')
    if(reportingToken){
        reporting['token'] = reportingToken
    }

    if(Object.keys(reporting).length > 0) {
        envConfig['reporting'] = reporting
    }

    let dataCapture: any = {}
    let httpHeadersRequest = getEnvValue('DATA_CAPTURE_HTTP_HEADERS_REQUEST')
    if(httpHeadersRequest){
        dataCapture['http_headers'] = {}
        dataCapture['http_headers']['request'] = isTrue(<string>httpHeadersRequest)
    }
    let httpHeadersResponse = getEnvValue('DATA_CAPTURE_HTTP_HEADERS_RESPONSE')
    if(httpHeadersResponse){
        dataCapture['http_headers'] ||= {}
        dataCapture['http_headers']['response'] = isTrue(<string>httpHeadersResponse)
    }

    let httpBodyRequest = getEnvValue('DATA_CAPTURE_HTTP_BODY_REQUEST')
    if(httpBodyRequest){
        dataCapture['http_body'] = {}
        dataCapture['http_body']['request'] = isTrue(<string>httpBodyRequest)
    }

    let httpBodyResponse = getEnvValue('DATA_CAPTURE_HTTP_BODY_RESPONSE')
    if(httpBodyResponse) {
        dataCapture['http_body'] ||= {}
        dataCapture['http_body']['response'] = isTrue(<string>httpBodyResponse)
    }

    let rpcMetadataRequest = getEnvValue('DATA_CAPTURE_RPC_METADATA_REQUEST')
    if(rpcMetadataRequest) {
        dataCapture['rpc_metadata'] = {}
        dataCapture['rpc_metadata']['request'] = isTrue(<string>rpcMetadataRequest)
    }

    let rpcMetadataResponse = getEnvValue('DATA_CAPTURE_RPC_METADATA_RESPONSE')
    if(rpcMetadataResponse){
        dataCapture['rpc_metadata'] ||= {}
        dataCapture['rpc_metadata']['response'] = isTrue(<string>rpcMetadataResponse)
    }

    let rpcBodyRequest = getEnvValue('DATA_CAPTURE_RPC_BODY_REQUEST')
    if(rpcBodyRequest) {
        dataCapture['rpc_body'] = {}
        dataCapture['rpc_body']['request'] = isTrue(<string>rpcBodyRequest)
    }

    let rpcBodyResponse = getEnvValue('DATA_CAPTURE_RPC_BODY_RESPONSE')
    if(rpcBodyRequest) {
        dataCapture['rpc_body'] ||= {}
        dataCapture['rpc_body']['response'] = isTrue(<string>rpcBodyResponse)
    }

    let bodyMaxSizeBytes = getEnvValue('DATA_CAPTURE_BODY_MAX_SIZE_BYTES')
    if(bodyMaxSizeBytes) {
        dataCapture['body_max_size_bytes'] = parseInt(<string>bodyMaxSizeBytes)
    }

    let bodyMaxProcessingSizeBytes = getEnvValue('DATA_CAPTURE_BODY_MAX_PROCESSING_SIZE_BYTES')
    if(bodyMaxProcessingSizeBytes){
        dataCapture['body_max_processing_size_bytes'] = parseInt(<string>bodyMaxProcessingSizeBytes)
    }

    if(Object.keys(dataCapture).length > 0 ){
        envConfig['data_capture'] = dataCapture
    }

    let propagationFormats = getEnvValue('PROPAGATION_FORMATS')
    if(propagationFormats) {
        envConfig['propagation_formats'] = propagationFormats.split(',')
    }

    return envConfig
}

function isTrue(value: string) {
    return value.toUpperCase() == 'TRUE'
}