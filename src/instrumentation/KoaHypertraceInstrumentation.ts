// Based on: https://github.com/open-telemetry/opentelemetry-js-contrib/pull/646/files
// the req + resp callback work should be pr'd + merged to OTEL(doing patch here just because of time to get those changes merged upstream)
import * as api from '@opentelemetry/api';
import {
    InstrumentationBase,
    InstrumentationConfig,
    InstrumentationNodeModuleDefinition,
    isWrapped,
} from '@opentelemetry/instrumentation';

import type * as koa from 'koa';
import {
    kLayerPatched,
    KoaComponentName,
    KoaContext,
    KoaLayerType,
    KoaMiddleware,
} from '@opentelemetry/instrumentation-koa/build/src/types'
import {AttributeNames} from '@opentelemetry/instrumentation-koa/build/src/enums/AttributeNames';
import {VERSION} from '@opentelemetry/instrumentation-koa/build/src/version';
import {getMiddlewareMetadata} from '@opentelemetry/instrumentation-koa/build/src/utils';
import {getRPCMetadata, RPCType, setRPCMetadata} from '@opentelemetry/core';
import {Exception, trace} from "@opentelemetry/api";

export interface KoaInstrumentationConfig extends InstrumentationConfig {
    /** Ignore specific layers based on their type */
    ignoreLayersType?: KoaLayerType[];
    requestCallback?: Function,
    responseCallback?: Function
}

/** Koa instrumentation for OpenTelemetry */
export class KoaHypertraceInstrumentation extends InstrumentationBase<typeof koa> {
    static readonly component = KoaComponentName;
    constructor(config?: KoaInstrumentationConfig) {
        super('@opentelemetry/instrumentation-koa', VERSION, config);
    }
    protected init() {
        return new InstrumentationNodeModuleDefinition<typeof koa>(
            'koa',
            ['^2.0.0'],
            moduleExports => {
                if (moduleExports == null) {
                    return moduleExports;
                }
                api.diag.debug('Patching Koa');
                if (isWrapped(moduleExports.prototype.use)) {
                    this._unwrap(moduleExports.prototype, 'use');
                }
                this._wrap(
                    moduleExports.prototype,
                    'use',
                    this._getKoaUsePatch.bind(this)
                );
                return moduleExports;
            },
            moduleExports => {
                api.diag.debug('Unpatching Koa');
                if (isWrapped(moduleExports.prototype.use)) {
                    this._unwrap(moduleExports.prototype, 'use');
                }
            }
        );
    }

    /**
     * Patches the Koa.use function in order to instrument each original
     * middleware layer which is introduced
     * @param {KoaMiddleware} middleware - the original middleware function
     */
    private _getKoaUsePatch(original: (middleware: KoaMiddleware) => koa) {
        const plugin = this;
        return function use(this: koa, middlewareFunction: KoaMiddleware) {
            let patchedFunction: KoaMiddleware;
            if (middlewareFunction.router) {
                patchedFunction = plugin._patchRouterDispatch(middlewareFunction);
            } else {
                patchedFunction = plugin._patchLayer(middlewareFunction, false);
            }
            return original.apply(this, [patchedFunction]);
        };
    }

    /**
     * Patches the dispatch function used by @koa/router. This function
     * goes through each routed middleware and adds instrumentation via a call
     * to the @function _patchLayer function.
     * @param {KoaMiddleware} dispatchLayer - the original dispatch function which dispatches
     * routed middleware
     */
    private _patchRouterDispatch(dispatchLayer: KoaMiddleware): KoaMiddleware {
        api.diag.debug('Patching @koa/router dispatch');

        const router = dispatchLayer.router;

        const routesStack = router?.stack ?? [];
        for (const pathLayer of routesStack) {
            const path = pathLayer.path;
            const pathStack = pathLayer.stack;
            for (let j = 0; j < pathStack.length; j++) {
                const routedMiddleware: KoaMiddleware = pathStack[j];
                pathStack[j] = this._patchLayer(routedMiddleware, true, path);
            }
        }

        return dispatchLayer;
    }

    /**
     * Patches each individual @param middlewareLayer function in order to create the
     * span and propagate context. It does not create spans when there is no parent span.
     * @param {KoaMiddleware} middlewareLayer - the original middleware function.
     * @param {boolean} isRouter - tracks whether the original middleware function
     * was dispatched by the router originally
     * @param {string?} layerPath - if present, provides additional data from the
     * router about the routed path which the middleware is attached to
     */
    private _patchLayer(
        middlewareLayer: KoaMiddleware,
        isRouter: boolean,
        layerPath?: string
    ): KoaMiddleware {
        const layerType = isRouter ? KoaLayerType.ROUTER : KoaLayerType.MIDDLEWARE;
        // Skip patching layer if its ignored in the config
        if (
            middlewareLayer[kLayerPatched] === true ||
            isLayerIgnored(layerType, this._config)
        ) {
            return middlewareLayer;
        }
        middlewareLayer[kLayerPatched] = true;
        api.diag.debug('patching Koa middleware layer');
        return async (context: KoaContext, next: koa.Next) => {
            const parent = api.trace.getSpan(api.context.active());
            if (parent === undefined) {
                return middlewareLayer(context, next);
            }
            const metadata = getMiddlewareMetadata(
                context,
                middlewareLayer,
                isRouter,
                layerPath
            );
            // diff
            // instead of generating a new span for koa we need to use the already
            // existing span created from http instrumentation
            // otherwise we end up with 2 server spans(with req + resp data) split across both of them
            const span = trace.getSpan(api.context.active())
            if(!span){
                return middlewareLayer(context, next);
            }
            // end of diff

            const rpcMetadata = getRPCMetadata(api.context.active());

            if (
                metadata.attributes[AttributeNames.KOA_TYPE] === KoaLayerType.ROUTER &&
                rpcMetadata?.type === RPCType.HTTP
            ) {
                rpcMetadata.span.updateName(
                    `${context.method} ${context._matchedRoute}`
                );
            }

            return api.context.with(api.context.active(), async () => {
                try {
                    // start of diff
                    // req attributes could be received from shimmer wrapping Koa.prototype.handleRequest
                    // this approach is slightly more straightforward since we already have to modify KoaConfig for the resp capture
                    let reqCallback = (<KoaInstrumentationConfig>this._config)?.requestCallback;
                    if(reqCallback) {
                        reqCallback(context, span)
                    }
                    // end of diff
                    return await middlewareLayer(context, next);
                } catch (err) {
                    span.recordException(<Exception>err);
                    // ts-ignore
                    if(err.name == 'ForbiddenError'){
                        span.setAttribute('http.status_code', 403)
                        span.setAttribute('http.status_text', 'FORBIDDEN')
                    }
                    throw err;
                } finally {
                    // start of diff:
                    // We need to call resp callback before span ends to collect resp attributes
                    let respCallback = (<KoaInstrumentationConfig>this._config)?.responseCallback;
                    if(respCallback) {
                        respCallback!(context, span)
                    }
                    // End of diff
                    span.end();
                }
            });
        };
    }
}
export const isLayerIgnored = (
    type: KoaLayerType,
    config?: KoaInstrumentationConfig
): boolean => {
    return !!(
        Array.isArray(config?.ignoreLayersType) &&
        config?.ignoreLayersType?.includes(type)
    );
};