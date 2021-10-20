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
let l = require('npmlog')
l.disableColor()
Object.defineProperty(l, 'heading', { get: () => { return `${new Date().toISOString()} [hypertrace]` } })
l.level = configuredLogLevel
l.addLevel('debug', 10000)

export const logger = l
