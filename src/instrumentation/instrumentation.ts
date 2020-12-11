import { LogLevel } from '@opentelemetry/core';
import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { HypertraceConfig} from './config'
// import here to ensure they're imported first before user code
//import '@opentelemetry/plugin-http';
//import '@opentelemetry/plugin-express';
export class HypertraceAgent {
  private readonly _provider: NodeTracerProvider;

  public constructor(config: HypertraceConfig) {
    // FIXME:
    //    this.provider = TraceableAgent.setupOpentelemetryProvider()
    this._provider = HypertraceAgent.setupOpentelemetryProvider(config)
  }

//   /** List of all default supported plugins */
// export const DEFAULT_INSTRUMENTATION_PLUGINS: Plugins = {
//   mongodb: { enabled: true, path: '@opentelemetry/plugin-mongodb' },
//   grpc: { enabled: true, path: '@opentelemetry/plugin-grpc' },
//   '@grpc/grpc-js': { enabled: true, path: '@opentelemetry/plugin-grpc-js' },
//   http: { enabled: true, path: '@opentelemetry/plugin-http' },
//   https: { enabled: true, path: '@opentelemetry/plugin-https' },
//   mysql: { enabled: true, path: '@opentelemetry/plugin-mysql' },
//   pg: { enabled: true, path: '@opentelemetry/plugin-pg' },
//   redis: { enabled: true, path: '@opentelemetry/plugin-redis' },
//   ioredis: { enabled: true, path: '@opentelemetry/plugin-ioredis' },
//   'pg-pool': { enabled: true, path: '@opentelemetry/plugin-pg-pool' },
//   express: { enabled: true, path: '@opentelemetry/plugin-express' },
//   '@hapi/hapi': { enabled: true, path: '@opentelemetry/hapi-instrumentation' },
//   koa: { enabled: true, path: '@opentelemetry/koa-instrumentation' },
//   dns: { enabled: true, path: '@opentelemetry/plugin-dns' },
// };
  private static setupOpentelemetryProvider(config: HypertraceConfig): NodeTracerProvider {
    // FIXME: Pass in config.
    const provider = new NodeTracerProvider({
      logLevel: LogLevel.INFO,
      // The default values for these plugins is actually true.
      // FIXME: Do we need these plugins to be explicitly set here so that there's no
      // and specified in package.json for them to be avaiable? We might need to set the enabled 
      // values of the plugins we dont support yet to false so they are not loaded.
      // Also do we need the paths to be set? No
      plugins: {
        // http: {
        //   enabled: true,
        // },
        // https: {
        //   enabled: true
        // },
        // FIXME: Opentelemetry has no express plugin
        // express: {
        //   enabled: true, // FIXME: remove package dependency on express.....
        // }
        mongodb: { 
          enabled: false
        },
        grpc: { 
          enabled: false
        },
        '@grpc/grpc-js': { 
          enabled: false
        },
        mysql: { 
          enabled: false
        },
        pg: { 
          enabled: false
        },
        redis: { 
          enabled: false
        },
        ioredis: { 
          enabled: false
        },
        'pg-pool': { 
          enabled: false
        },
        express: { 
          enabled: false
        },
        '@hapi/hapi': { 
          enabled: false
        },
        koa: { 
          enabled: false
        },
        dns: { 
          enabled: false
        },
      }
    });
    provider.register();
    provider.addSpanProcessor(
      // FIXME: move to batched
      new SimpleSpanProcessor(
        // FIXME: move to jaeger
        new ZipkinExporter({
          url: config.collectorUrl,
          serviceName: config.serviceName
        })
      )
    );
    // FIXME: how to do logging?
    provider.logger.info("OpenTelemetry provider initialized")
    return provider
  }
}
//const agent = new HypertraceAgent()
//new HypertraceAgent()