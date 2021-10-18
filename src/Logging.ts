import winston, {transports} from "winston";
import {getEnvValue} from "./config/envSettings";

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

export const htLogger = winston.createLogger({
    transports: [
        new transports.Console({
            level: <string>configuredLogLevel,
            format: winston.format.simple(),
        })
    ]
});