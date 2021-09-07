// import { AgentConfig } from "../../agent-config/proto/hypertrace/agent/config/v1/config_pb";
import {DEFAULT_AGENT_CONFIG} from "./defaults";
import {getEnvValue} from "./envSettings";
import {PathOrFileDescriptor, readFileSync} from 'fs';
import YAML from 'yaml'
import {loadFromEnv} from "./envConfigReader";
import {hypertrace} from "./generated";


export class Config {
  config: any
  constructor() {
    let configData = this.load()
    this.config = hypertrace.agent.config.v1.AgentConfig.create(configData)
  }

  // Config order of precedence
  // 1.) Default
  // 2.) Overwritten by config file
  // 3.) Overwritten by env vars
  load(): object {
    let configObj = DEFAULT_AGENT_CONFIG
    let fileObj = Config.loadFromFile()
    if(fileObj){
      configObj = Config.mergeConfig(configObj, fileObj)
    }
    let envObj = loadFromEnv()
    configObj = Config.mergeConfig(configObj, envObj)

    return configObj
  }

  private static loadFromFile(): object | null{
    let envPath = getEnvValue('CONFIG_FILE')
    if(envPath){
      const fileContents = readFileSync(<PathOrFileDescriptor>envPath, 'utf-8')
      return YAML.parse(fileContents)
    }
    return null
  }

  private static mergeConfig(baseConfig: any, overridingConfig: any) {
    for(let key in overridingConfig){
      if(key in baseConfig && typeof baseConfig[key] === 'object') {
        if(key in overridingConfig) {
          baseConfig[key] = Config.mergeConfig(baseConfig[key], overridingConfig[key])
        }
      } else {
        if(key == 'propagation_formats') {
          if(key in baseConfig) {
            baseConfig[key] = new Set(...baseConfig[key], ...overridingConfig[key])
          } else {
            baseConfig[key] = overridingConfig[key]
          }
        } else {
          baseConfig[key] = overridingConfig[key]
        }
      }
    }
    return baseConfig
  }
}