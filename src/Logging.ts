import winston, {format, transports} from "winston";
import {getEnvValue} from "./config/envSettings";
const { combine, timestamp, label, printf } = format;

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
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
    format: combine(
        label({ label: 'hypertrace' }),
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console({
        level: <string>configuredLogLevel,
    })]
});