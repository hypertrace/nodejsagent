/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import RequireInTheMiddle from 'require-in-the-middle';
import ImportInTheMiddle from 'import-in-the-middle';
import { InstrumentationModuleDefinition } from '@opentelemetry/instrumentation/build/src/platform/node/types';
import {InstrumentationBase} from "@opentelemetry/instrumentation";

/**
 * Base abstract class for instrumenting node plugins
 */
InstrumentationBase.prototype.enable = function() {
    // @ts-ignore
    if(this._enabled) {
        return;
    }
    // @ts-ignore
    this._enabled = true;
    // @ts-ignore
    if (this._hooks.length > 0) {
        // @ts-ignore
        for (const module of this._modules) {
            if (typeof module.patch === 'function' && module.moduleExports) {
                module.patch(module.moduleExports, module.moduleVersion);
            }
            for (const file of module.files) {
                if (file.moduleExports) {
                    file.patch(file.moduleExports, module.moduleVersion);
                }
            }
        }
        return;
    }
    // @ts-ignore
    for (const module of this._modules) {
        // @ts-ignore

        // @ts-ignore
        const hookFn = (exports, name, baseDir) => {
            // @ts-ignore
            return this._onRequire<typeof exports>(
                (module as unknown) as InstrumentationModuleDefinition<
                    typeof exports
                    >,
                exports,
                name,
                baseDir
            );
        };
        // @ts-ignore
        this._hooks.push(hookFn);
        RequireInTheMiddle([module.name], { internals: true }, hookFn);
        // @ts-ignore
        ImportInTheMiddle([module.name], { internals: true }, hookFn);
    }
}