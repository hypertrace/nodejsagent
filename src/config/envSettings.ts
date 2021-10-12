const DEFAULT_PREFIX = 'HT'
export const PREFIXES = [DEFAULT_PREFIX]

export function getEnvValue(key: String): String | null{
    for(let prefix of PREFIXES) {
        let envKeyWithPrefix = `${prefix}_${key}`
        if(envKeyWithPrefix in process.env) {
            return <string>process.env[envKeyWithPrefix]

        }
    }
    return null
}