import {getEnvValue} from "./config/envSettings";
import log, {Logger, LogLevelDesc} from 'loglevel';
const prefix = require('loglevel-plugin-prefix');



const validLogLevels = ['debug', 'info', 'warn', 'error']
let configuredLogLevel = getEnvValue('LOG_LEVEL')
if(configuredLogLevel == null) {
    configuredLogLevel = 'info'
} else {
    configuredLogLevel = configuredLogLevel.toLowerCase()
    if(validLogLevels.indexOf(<string>configuredLogLevel) < 0) {
        configuredLogLevel = 'info'
    }
}

prefix.reg(log);
const htLogger = log.getLogger('hypertrace')

let defaults = {
    template: '[%t] %l (%n)',
    levelFormatter(level : string) {
        return level.toUpperCase();
    },
    nameFormatter(name : string) {
        return 'hypertrace';
    },
    timestampFormatter(date : Date) {
        return date.toISOString();
    },
};

htLogger.setLevel(<LogLevelDesc>configuredLogLevel);
prefix.apply(htLogger, defaults);

export const logger = htLogger
