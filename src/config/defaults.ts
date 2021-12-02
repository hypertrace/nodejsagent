const DEFAULT_AGENT_CONFIG = {
    'enabled': true,
    'propagation_formats': ['TRACECONTEXT'],
    'service_name': 'nodeagent',
    'reporting': {
        'endpoint': 'http://localhost:4317',
        'secure': false,
        'trace_reporter_type': 'OTLP',
        'token': '',
        'opa': {
            'endpoint': 'http://opa.traceableai:8181/',
            'poll_period_seconds': 60,
            'enabled': false,
        }
    },
    'data_capture': {
        'http_headers': {
            'request': true,
            'response': true,
        },
        'http_body': {
            'request': true,
            'response': true,
        },
        'rpc_metadata': {
            'request': true,
            'response': true,
        },
        'rpc_body': {
            'request': true,
            'response': true,
        },
        'body_max_size_bytes': 131072,
        'body_max_processing_size_bytes': 1048576
    },
    'resource_attributes': {}
}

export function getDefaultConfigValues(){
    return JSON.parse(JSON.stringify(DEFAULT_AGENT_CONFIG));
}