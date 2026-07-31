const RUNTIME_PUBLIC_PATH = "server/chunks/[turbopack]_runtime.js";
const RELATIVE_ROOT_PATH = "..";
const ASSET_PREFIX = "/";
const WORKER_FORWARDED_GLOBALS = ["NEXT_DEPLOYMENT_ID","NEXT_CLIENT_ASSET_SUFFIX"];
// Apply forwarded globals from workerData if running in a worker thread
if (typeof require !== 'undefined') {
    try {
        const { workerData } = require('worker_threads');
        if (workerData?.__turbopack_globals__) {
            Object.assign(globalThis, workerData.__turbopack_globals__);
            // Remove internal data so it's not visible to user code
            delete workerData.__turbopack_globals__;
        }
    } catch (_) {
        // Not in a worker thread context, ignore
    }
}
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
/**
 * Describes why a module was instantiated.
 * Shared between browser and Node.js runtimes.
 */ var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    /**
   * The module was instantiated because it was included in a chunk's hot module
   * update.
   * SourceData is an array of ModuleIds or undefined.
   */ SourceType[SourceType["Update"] = 2] = "Update";
    return SourceType;
}(SourceType || {});
/**
 * Flag indicating which module object type to create when a module is merged. Set to `true`
 * by each runtime that uses ModuleWithDirection (browser dev-base.ts, nodejs dev-base.ts,
 * nodejs build-base.ts). Browser production (build-base.ts) leaves it as `false` since it
 * uses plain Module objects.
 */ let createModuleWithDirectionFlag = false;
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        if (createModuleWithDirectionFlag) {
            // set in development modes for hmr support
            module = createModuleWithDirection(id);
        } else {
            module = createModuleObject(id);
        }
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
function createModuleWithDirection(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined,
        parents: [],
        children: []
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                for (const obj of reexportedObjects){
                    const value = Reflect.get(obj, prop);
                    if (value !== undefined) return value;
                }
                return undefined;
            },
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Install the factory for each module ID that doesn't already have one.
        // When some IDs in this group already have a factory, reuse that existing
        // group factory for the missing IDs to keep all IDs in the group consistent.
        // Otherwise, install the factory from this chunk.
        const moduleFactoryFn = chunkModules[end];
        let existingGroupFactory = undefined;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            const existingFactory = moduleFactories.get(id);
            if (existingFactory) {
                existingGroupFactory = existingFactory;
                break;
            }
        }
        const factoryToInstall = existingGroupFactory ?? moduleFactoryFn;
        let didInstallFactory = false;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            if (!moduleFactories.has(id)) {
                if (!didInstallFactory) {
                    if (factoryToInstall === moduleFactoryFn) {
                        applyModuleFactoryName(moduleFactoryFn);
                    }
                    didInstallFactory = true;
                }
                moduleFactories.set(id, factoryToInstall);
                newModuleId?.(id);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * Constructs an error message for when a module factory is not available.
 */ function factoryNotAvailableMessage(moduleId, sourceType, sourceData) {
    let instantiationReason;
    switch(sourceType){
        case 0:
            instantiationReason = `as a runtime entry of chunk ${sourceData}`;
            break;
        case 1:
            instantiationReason = `because it was required from module ${sourceData}`;
            break;
        case 2:
            instantiationReason = 'because of an HMR update';
            break;
        default:
            invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
    }
    return `Module ${moduleId} was instantiated ${instantiationReason}, but the module factory is not available.`;
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime/runtime-utils.ts" />
function readWebAssemblyAsResponse(path) {
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const stream = createReadStream(path);
    // @ts-ignore unfortunately there's a slight type mismatch with the stream.
    return new Response(Readable.toWeb(stream), {
        headers: {
            'content-type': 'application/wasm'
        }
    });
}
async function compileWebAssemblyFromPath(path) {
    const response = readWebAssemblyAsResponse(path);
    return await WebAssembly.compileStreaming(response);
}
async function instantiateWebAssemblyFromPath(path, importsObj) {
    const response = readWebAssemblyAsResponse(path);
    const { instance } = await WebAssembly.instantiateStreaming(response, importsObj);
    return instance.exports;
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../../shared/runtime/runtime-utils.ts" />
/// <reference path="../../shared-node/base-externals-utils.ts" />
/// <reference path="../../shared-node/node-externals-utils.ts" />
/// <reference path="../../shared-node/node-wasm-utils.ts" />
/// <reference path="./nodejs-globals.d.ts" />
/**
 * Base Node.js runtime shared between production and development.
 * Contains chunk loading, module caching, and other non-HMR functionality.
 */ process.env.TURBOPACK = '1';
const url = require('url');
const moduleFactories = new Map();
const moduleCache = Object.create(null);
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
/**
 * Exports a URL value. No suffix is added in Node.js runtime.
 */ function exportUrl(urlValue, id) {
    exportValue.call(this, urlValue, id);
}
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
    loadedChunks.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
async function loadWebAssembly(chunkPath, _edgeModule, imports) {
  const mod = await loadWasmChunk(chunkPath);
  const { exports } = await WebAssembly.instantiate(mod, imports);
  return exports;
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, _edgeModule) {
  return loadWasmChunk(chunkPath);
}
contextPrototype.u = loadWebAssemblyModule;
/**
 * Creates a Node.js worker thread by instantiating the given WorkerConstructor
 * with the appropriate path and options, including forwarded globals.
 *
 * @param WorkerConstructor The Worker constructor from worker_threads
 * @param workerPath Path to the worker entry chunk
 * @param workerOptions options to pass to the Worker constructor (optional)
 */ function createWorker(WorkerConstructor, workerPath, workerOptions) {
    // Build the forwarded globals object
    const forwardedGlobals = {};
    for (const name of WORKER_FORWARDED_GLOBALS){
        forwardedGlobals[name] = globalThis[name];
    }
    // Merge workerData with forwarded globals
    const existingWorkerData = workerOptions?.workerData || {};
    const options = {
        ...workerOptions,
        workerData: {
            ...typeof existingWorkerData === 'object' ? existingWorkerData : {},
            __turbopack_globals__: forwardedGlobals
        }
    };
    return new WorkerConstructor(workerPath, options);
}
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-base.ts" />
/**
 * Production Node.js runtime.
 * Uses ModuleWithDirection and simple module instantiation without HMR support.
 */ // moduleCache and moduleFactories are declared in runtime-base.ts
// this is read in runtime-utils.ts so it creates a module with direction for hmr
createModuleWithDirectionFlag = true;
const nodeContextPrototype = Context.prototype;
nodeContextPrototype.q = exportUrl;
nodeContextPrototype.M = moduleFactories;
// Cast moduleCache to ModuleWithDirection for production mode
nodeContextPrototype.c = moduleCache;
nodeContextPrototype.R = resolvePathFromModule;
nodeContextPrototype.b = createWorker;
nodeContextPrototype.C = clearChunkCache;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        throw new Error(factoryNotAvailableMessage(id, sourceType, sourceData));
    }
    const module1 = createModuleWithDirection(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    ;
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, SourceType.Parent, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, SourceType.Runtime, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/[root-of-the-server]__0iltm2z._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0iltm2z._.js");
      case "server/chunks/ssr/[root-of-the-server]__0lrptj6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0lrptj6._.js");
      case "server/chunks/ssr/[root-of-the-server]__1lp9cj9._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1lp9cj9._.js");
      case "server/chunks/ssr/[root-of-the-server]__1vfpvus._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1vfpvus._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_10ihyw2._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_10ihyw2._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js");
      case "server/chunks/ssr/lib_utils_cn_ts_0zlv-j8._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/lib_utils_cn_ts_0zlv-j8._.js");
      case "server/chunks/ssr/lib_utils_cn_ts_1gr_p-v._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/lib_utils_cn_ts_1gr_p-v._.js");
      case "server/chunks/ssr/node_modules_0h91jdk._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_0h91jdk._.js");
      case "server/chunks/ssr/node_modules_next_17sz44y._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_17sz44y._.js");
      case "server/chunks/ssr/node_modules_next_dist_0gqiype._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0gqiype._.js");
      case "server/chunks/ssr/node_modules_next_dist_0uboya6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0uboya6._.js");
      case "server/chunks/ssr/node_modules_next_dist_1h4k0e-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1h4k0e-._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_0wpq8j3._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_0wpq8j3._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0symwr9.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0symwr9.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1vmwyi-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1vmwyi-.js");
      case "server/chunks/ssr/[root-of-the-server]__1z5ldc8._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1z5ldc8._.js");
      case "server/chunks/ssr/_014wio2._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_014wio2._.js");
      case "server/chunks/ssr/_11g3vqr._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_11g3vqr._.js");
      case "server/chunks/ssr/_1wqemyq._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1wqemyq._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_page_actions_1mcickz.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_page_actions_1mcickz.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0-o-goa.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0-o-goa.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0hx7sy-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0hx7sy-.js");
      case "server/chunks/ssr/node_modules_zod_v4_classic_external_071rx-x.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_zod_v4_classic_external_071rx-x.js");
      case "server/chunks/[root-of-the-server]__0xuaoik._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0xuaoik._.js");
      case "server/chunks/[root-of-the-server]__1yjgi9u._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1yjgi9u._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/_052tmhv._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_052tmhv._.js");
      case "server/chunks/_next-internal_server_app_api_admin_blog_cover_route_actions_00xgp4f.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_blog_cover_route_actions_00xgp4f.js");
      case "server/chunks/node_modules_zod_v4_classic_external_1-pw2v2.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_zod_v4_classic_external_1-pw2v2.js");
      case "server/chunks/[root-of-the-server]__0j3rr_4._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0j3rr_4._.js");
      case "server/chunks/_1p03b6q._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_1p03b6q._.js");
      case "server/chunks/_next-internal_server_app_api_admin_blog_parse_route_actions_1qhyfxt.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_blog_parse_route_actions_1qhyfxt.js");
      case "server/chunks/[root-of-the-server]__02our8s._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__02our8s._.js");
      case "server/chunks/_next-internal_server_app_api_admin_blog_preview_route_actions_0cnyg71.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_blog_preview_route_actions_0cnyg71.js");
      case "server/chunks/[root-of-the-server]__0fa0av0._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0fa0av0._.js");
      case "server/chunks/_next-internal_server_app_api_admin_blog_route_actions_0psznr6.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_blog_route_actions_0psznr6.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_08z3sdu.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_08z3sdu.js");
      case "server/chunks/_next-internal_server_app_api_admin_blog_[id]_route_actions_1iiunrv.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_blog_[id]_route_actions_1iiunrv.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_0g65ttn.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_0g65ttn.js");
      case "server/chunks/_next-internal_server_app_api_admin_categories_route_actions_1lz0ocd.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_categories_route_actions_1lz0ocd.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_0e2ihvx.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_0e2ihvx.js");
      case "server/chunks/_next-internal_server_app_api_admin_categories_[id]_route_actions_1wr1q1h.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_categories_[id]_route_actions_1wr1q1h.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_07gqp0l.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_07gqp0l.js");
      case "server/chunks/[root-of-the-server]__0qgre2w._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0qgre2w._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_playlists_route_actions_086q0rv.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_playlists_route_actions_086q0rv.js");
      case "server/chunks/lib_focus_service_ts_1m775rv._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/lib_focus_service_ts_1m775rv._.js");
      case "server/chunks/[root-of-the-server]__0bwrjr-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0bwrjr-._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_playlists_[id]_route_actions_1b7v5-t.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_playlists_[id]_route_actions_1b7v5-t.js");
      case "server/chunks/[root-of-the-server]__0-08jlv._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0-08jlv._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_settings_route_actions_06_2wqp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_settings_route_actions_06_2wqp.js");
      case "server/chunks/[root-of-the-server]__01r247i._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__01r247i._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_sounds_route_actions_1twek0r.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_sounds_route_actions_1twek0r.js");
      case "server/chunks/[root-of-the-server]__0wjo0us._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0wjo0us._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_sounds_upload_route_actions_0huvtu_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_sounds_upload_route_actions_0huvtu_.js");
      case "server/chunks/[root-of-the-server]__0l1oepj._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0l1oepj._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_sounds_[id]_route_actions_1ac_7c6.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_sounds_[id]_route_actions_1ac_7c6.js");
      case "server/chunks/[root-of-the-server]__0zwfa4b._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0zwfa4b._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_themes_route_actions_17y4h5t.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_themes_route_actions_17y4h5t.js");
      case "server/chunks/[root-of-the-server]__06bu2ko._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__06bu2ko._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_themes_upload_route_actions_14zvtmo.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_themes_upload_route_actions_14zvtmo.js");
      case "server/chunks/[root-of-the-server]__01206hl._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__01206hl._.js");
      case "server/chunks/_next-internal_server_app_api_admin_focus_themes_[id]_route_actions_0_b0c44.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_focus_themes_[id]_route_actions_0_b0c44.js");
      case "server/chunks/_next-internal_server_app_api_admin_list100_reorder_route_actions_10lgs4b.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_list100_reorder_route_actions_10lgs4b.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_0doq01w.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_0doq01w.js");
      case "server/chunks/_next-internal_server_app_api_admin_list100_route_actions_1j88w97.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_list100_route_actions_1j88w97.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_1j0a_1b.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_1j0a_1b.js");
      case "server/chunks/_next-internal_server_app_api_admin_list100_suggestions_route_actions_1c44zuj.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_list100_suggestions_route_actions_1c44zuj.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_1bxj26q.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_1bxj26q.js");
      case "server/chunks/1oeh_server_app_api_admin_list100_suggestions_[id]_route_actions_01xk4_6.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_admin_list100_suggestions_[id]_route_actions_01xk4_6.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_1wu3_jf.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_1wu3_jf.js");
      case "server/chunks/_next-internal_server_app_api_admin_list100_[id]_route_actions_1zz0tvz.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_list100_[id]_route_actions_1zz0tvz.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_1tnw3jk.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_1tnw3jk.js");
      case "server/chunks/1oeh_server_app_api_admin_market_calendar-settings_route_actions_1j3r2gu.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_admin_market_calendar-settings_route_actions_1j3r2gu.js");
      case "server/chunks/[root-of-the-server]__1at9zd-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1at9zd-._.js");
      case "server/chunks/[root-of-the-server]__0mvzimm._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0mvzimm._.js");
      case "server/chunks/_next-internal_server_app_api_admin_market_news-sources_route_actions_1di7mip.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_market_news-sources_route_actions_1di7mip.js");
      case "server/chunks/1oeh_server_app_api_admin_market_news-sources_[id]_route_actions_1mc1k8x.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_admin_market_news-sources_[id]_route_actions_1mc1k8x.js");
      case "server/chunks/[root-of-the-server]__1y0rwjx._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1y0rwjx._.js");
      case "server/chunks/[root-of-the-server]__20i-lnu._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__20i-lnu._.js");
      case "server/chunks/_next-internal_server_app_api_admin_market_portfolios_route_actions_1l1xn31.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_market_portfolios_route_actions_1l1xn31.js");
      case "server/chunks/[root-of-the-server]__0bydgt-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0bydgt-._.js");
      case "server/chunks/_next-internal_server_app_api_admin_market_price-settings_route_actions_0oom5fb.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_market_price-settings_route_actions_0oom5fb.js");
      case "server/chunks/[root-of-the-server]__0-hv9m6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0-hv9m6._.js");
      case "server/chunks/_next-internal_server_app_api_admin_market_price-symbols_route_actions_1f4sc_3.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_market_price-symbols_route_actions_1f4sc_3.js");
      case "server/chunks/1oeh_server_app_api_admin_market_price-symbols_[id]_route_actions_0p_z8rl.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_admin_market_price-symbols_[id]_route_actions_0p_z8rl.js");
      case "server/chunks/[root-of-the-server]__15-6-ob._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__15-6-ob._.js");
      case "server/chunks/_next-internal_server_app_api_admin_tools_route_actions_0p20rcg.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_tools_route_actions_0p20rcg.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_0g3pw98.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_0g3pw98.js");
      case "server/chunks/_next-internal_server_app_api_admin_tools_[id]_route_actions_0f3vr3m.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_tools_[id]_route_actions_0f3vr3m.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_0wn1fdt.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_0wn1fdt.js");
      case "server/chunks/_next-internal_server_app_api_admin_users_route_actions_0q-rtz1.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_users_route_actions_0q-rtz1.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_212boov.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_212boov.js");
      case "server/chunks/_next-internal_server_app_api_admin_users_[id]_route_actions_1hhpuc4.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_admin_users_[id]_route_actions_1hhpuc4.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_18aqn5w.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_18aqn5w.js");
      case "server/chunks/[root-of-the-server]__1kfsw7u._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1kfsw7u._.js");
      case "server/chunks/_next-internal_server_app_api_auth_avatar_route_actions_1zlb0-7.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_avatar_route_actions_1zlb0-7.js");
      case "server/chunks/[root-of-the-server]__0eo_voo._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0eo_voo._.js");
      case "server/chunks/_next-internal_server_app_api_auth_change-password_route_actions_0dcnj10.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_change-password_route_actions_0dcnj10.js");
      case "server/chunks/[root-of-the-server]__1w0xv7r._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1w0xv7r._.js");
      case "server/chunks/_next-internal_server_app_api_auth_login_route_actions_1ox7zi0.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_login_route_actions_1ox7zi0.js");
      case "server/chunks/[root-of-the-server]__0axfi3l._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0axfi3l._.js");
      case "server/chunks/_next-internal_server_app_api_auth_logout_route_actions_0regwyr.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_logout_route_actions_0regwyr.js");
      case "server/chunks/[root-of-the-server]__1x_px5_._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1x_px5_._.js");
      case "server/chunks/_next-internal_server_app_api_auth_me_route_actions_17uv6xh.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_me_route_actions_17uv6xh.js");
      case "server/chunks/[root-of-the-server]__1blyugi._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1blyugi._.js");
      case "server/chunks/_next-internal_server_app_api_auth_profile_route_actions_0vb3oco.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_profile_route_actions_0vb3oco.js");
      case "server/chunks/[root-of-the-server]__1xlmaq4._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1xlmaq4._.js");
      case "server/chunks/_next-internal_server_app_api_auth_register_route_actions_0g4vfdr.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_register_route_actions_0g4vfdr.js");
      case "server/chunks/[root-of-the-server]__1dh93nh._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1dh93nh._.js");
      case "server/chunks/_next-internal_server_app_api_avatar_[userId]_route_actions_15sm-_l.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_avatar_[userId]_route_actions_15sm-_l.js");
      case "server/chunks/[root-of-the-server]__00khi6n._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__00khi6n._.js");
      case "server/chunks/_next-internal_server_app_api_blog_cover_[key]_route_actions_14g8kuc.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_blog_cover_[key]_route_actions_14g8kuc.js");
      case "server/chunks/[root-of-the-server]__15r5f4h._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__15r5f4h._.js");
      case "server/chunks/_next-internal_server_app_api_focus_habits_route_actions_122o5q2.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_habits_route_actions_122o5q2.js");
      case "server/chunks/[root-of-the-server]__0391kqs._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0391kqs._.js");
      case "server/chunks/_next-internal_server_app_api_focus_habits_[id]_logs_route_actions_13ntbsc.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_habits_[id]_logs_route_actions_13ntbsc.js");
      case "server/chunks/[root-of-the-server]__0p5m5d7._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0p5m5d7._.js");
      case "server/chunks/_next-internal_server_app_api_focus_habits_[id]_route_actions_09qmz_7.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_habits_[id]_route_actions_09qmz_7.js");
      case "server/chunks/[root-of-the-server]__1dhj-f4._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1dhj-f4._.js");
      case "server/chunks/_next-internal_server_app_api_focus_import_route_actions_1z7jz-b.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_import_route_actions_1z7jz-b.js");
      case "server/chunks/[root-of-the-server]__1-_5ggl._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1-_5ggl._.js");
      case "server/chunks/_0-h5bz3._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_0-h5bz3._.js");
      case "server/chunks/_next-internal_server_app_api_focus_playlists_route_actions_0e-fqlr.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_playlists_route_actions_0e-fqlr.js");
      case "server/chunks/[root-of-the-server]__1kid_no._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1kid_no._.js");
      case "server/chunks/_next-internal_server_app_api_focus_presets_route_actions_0to5pat.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_presets_route_actions_0to5pat.js");
      case "server/chunks/[root-of-the-server]__09yo-10._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__09yo-10._.js");
      case "server/chunks/_next-internal_server_app_api_focus_presets_[id]_route_actions_0_ed6ml.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_presets_[id]_route_actions_0_ed6ml.js");
      case "server/chunks/[root-of-the-server]__1732pb2._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1732pb2._.js");
      case "server/chunks/_next-internal_server_app_api_focus_sessions_route_actions_0zn8wbq.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_sessions_route_actions_0zn8wbq.js");
      case "server/chunks/[root-of-the-server]__1uusz4m._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1uusz4m._.js");
      case "server/chunks/_next-internal_server_app_api_focus_settings_route_actions_1u3p-46.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_settings_route_actions_1u3p-46.js");
      case "server/chunks/[root-of-the-server]__1s_3e1q._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1s_3e1q._.js");
      case "server/chunks/_next-internal_server_app_api_focus_sounds_route_actions_0g58g-n.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_sounds_route_actions_0g58g-n.js");
      case "server/chunks/[root-of-the-server]__1l5cca0._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1l5cca0._.js");
      case "server/chunks/_next-internal_server_app_api_focus_sounds_[key]_route_actions_158yon1.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_sounds_[key]_route_actions_158yon1.js");
      case "server/chunks/[root-of-the-server]__0c-v3h9._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0c-v3h9._.js");
      case "server/chunks/_next-internal_server_app_api_focus_stats_route_actions_1banii2.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_stats_route_actions_1banii2.js");
      case "server/chunks/[root-of-the-server]__0os_rcn._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0os_rcn._.js");
      case "server/chunks/_next-internal_server_app_api_focus_tasks_route_actions_0ucmfka.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_tasks_route_actions_0ucmfka.js");
      case "server/chunks/[root-of-the-server]__1x7lldm._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1x7lldm._.js");
      case "server/chunks/_next-internal_server_app_api_focus_tasks_[id]_route_actions_1dgxkzu.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_tasks_[id]_route_actions_1dgxkzu.js");
      case "server/chunks/[root-of-the-server]__09bi11z._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__09bi11z._.js");
      case "server/chunks/_next-internal_server_app_api_focus_themes_asset_[key]_route_actions_1mz842u.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_themes_asset_[key]_route_actions_1mz842u.js");
      case "server/chunks/[root-of-the-server]__1hz1cfq._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1hz1cfq._.js");
      case "server/chunks/_next-internal_server_app_api_focus_themes_route_actions_0kgp73-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_focus_themes_route_actions_0kgp73-.js");
      case "server/chunks/[root-of-the-server]__12w3ch7._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__12w3ch7._.js");
      case "server/chunks/_1vm75fk._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_1vm75fk._.js");
      case "server/chunks/_next-internal_server_app_api_list100_suggestions_route_actions_0lw4ol0.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_list100_suggestions_route_actions_0lw4ol0.js");
      case "server/chunks/[root-of-the-server]__0uq_lrl._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0uq_lrl._.js");
      case "server/chunks/_next-internal_server_app_api_market_instruments_route_actions_0rddu3o.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_market_instruments_route_actions_0rddu3o.js");
      case "server/chunks/[root-of-the-server]__05g574b._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__05g574b._.js");
      case "server/chunks/_next-internal_server_app_api_market_news_route_actions_02j6tsn.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_market_news_route_actions_02j6tsn.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_0vxfva7.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_0vxfva7.js");
      case "server/chunks/[root-of-the-server]__1b24q_p._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1b24q_p._.js");
      case "server/chunks/_next-internal_server_app_api_market_portfolio_assets_route_actions_0ooqwc3.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_market_portfolio_assets_route_actions_0ooqwc3.js");
      case "server/chunks/1oeh_server_app_api_market_portfolio_assets_[id]_price_route_actions_08_8ppl.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_market_portfolio_assets_[id]_price_route_actions_08_8ppl.js");
      case "server/chunks/[root-of-the-server]__03h6en6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__03h6en6._.js");
      case "server/chunks/[root-of-the-server]__0d4-e3s._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0d4-e3s._.js");
      case "server/chunks/_next-internal_server_app_api_market_portfolio_assets_[id]_route_actions_0supe45.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_market_portfolio_assets_[id]_route_actions_0supe45.js");
      case "server/chunks/1oeh_server_app_api_market_portfolio_assets_[id]_transactions_route_actions_1_sgv-n.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_market_portfolio_assets_[id]_transactions_route_actions_1_sgv-n.js");
      case "server/chunks/[root-of-the-server]__0ps_ssb._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0ps_ssb._.js");
      case "server/chunks/1oeh_server_app_api_market_portfolio_transactions_[id]_route_actions_0w4jew5.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/1oeh_server_app_api_market_portfolio_transactions_[id]_route_actions_0w4jew5.js");
      case "server/chunks/[root-of-the-server]__09dzm7z._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__09dzm7z._.js");
      case "server/chunks/[root-of-the-server]__149re58._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__149re58._.js");
      case "server/chunks/_next-internal_server_app_api_market_prices_stream_route_actions_0g-toot.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_market_prices_stream_route_actions_0g-toot.js");
      case "server/chunks/[root-of-the-server]__1tmiltm._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1tmiltm._.js");
      case "server/chunks/_next-internal_server_app_api_shortlink_my_route_actions_0sce5h_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_shortlink_my_route_actions_0sce5h_.js");
      case "server/chunks/[root-of-the-server]__12_izig._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__12_izig._.js");
      case "server/chunks/_next-internal_server_app_api_shortlink_route_actions_1vaucff.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_shortlink_route_actions_1vaucff.js");
      case "server/chunks/[root-of-the-server]__1fec_8k._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1fec_8k._.js");
      case "server/chunks/_next-internal_server_app_api_shortlink_[code]_route_actions_15d058x.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_shortlink_[code]_route_actions_15d058x.js");
      case "server/chunks/[root-of-the-server]__0q3f-hl._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0q3f-hl._.js");
      case "server/chunks/_next-internal_server_app_api_toolbox_favorites_route_actions_1y7snfp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_toolbox_favorites_route_actions_1y7snfp.js");
      case "server/chunks/[root-of-the-server]__0itlj9j._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0itlj9j._.js");
      case "server/chunks/_next-internal_server_app_api_toolbox_favorites_[slug]_route_actions_0xa3uko.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_toolbox_favorites_[slug]_route_actions_0xa3uko.js");
      case "server/chunks/ssr/[root-of-the-server]__1-1i6wr._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1-1i6wr._.js");
      case "server/chunks/ssr/_1i-j4dx._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1i-j4dx._.js");
      case "server/chunks/ssr/_1rhzbob._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1rhzbob._.js");
      case "server/chunks/ssr/_next-internal_server_app_blog_page_actions_1nf9zaw.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_blog_page_actions_1nf9zaw.js");
      case "server/chunks/ssr/node_modules_next_dist_1enzot_._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1enzot_._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0wxodlm.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0wxodlm.js");
      case "server/chunks/ssr/[root-of-the-server]__1dw48vh._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1dw48vh._.js");
      case "server/chunks/ssr/_20xtmqk._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_20xtmqk._.js");
      case "server/chunks/ssr/_next-internal_server_app_blog_[slug]_page_actions_1xd8lf6.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_blog_[slug]_page_actions_1xd8lf6.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1p2xour.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1p2xour.js");
      case "server/chunks/ssr/[root-of-the-server]__1rx8mxq._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1rx8mxq._.js");
      case "server/chunks/ssr/_next-internal_server_app_bucket-list_page_actions_09hbup0.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_bucket-list_page_actions_09hbup0.js");
      case "server/chunks/ssr/components_list100_SuggestionForm_tsx_0djnq_r._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_list100_SuggestionForm_tsx_0djnq_r._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_11blv3y.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_11blv3y.js");
      case "server/chunks/[externals]_next_dist_0iuj5m_._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[externals]_next_dist_0iuj5m_._.js");
      case "server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_1n41rqb.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_1n41rqb.js");
      case "server/chunks/_next-internal_server_app_icon_svg_route_actions_1r2h_ub.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_icon_svg_route_actions_1r2h_ub.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_1e8y6a0.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_1e8y6a0.js");
      case "server/chunks/ssr/[root-of-the-server]__0s7nrac._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0s7nrac._.js");
      case "server/chunks/ssr/_next-internal_server_app_login_page_actions_04fnjo0.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_login_page_actions_04fnjo0.js");
      case "server/chunks/ssr/app_login_page_tsx_1nv--5q._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_login_page_tsx_1nv--5q._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0dks0q9.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0dks0q9.js");
      case "server/chunks/ssr/[root-of-the-server]__0fl-yp6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0fl-yp6._.js");
      case "server/chunks/ssr/_1ca3pq5._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1ca3pq5._.js");
      case "server/chunks/ssr/_1wzs2ds._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1wzs2ds._.js");
      case "server/chunks/ssr/_next-internal_server_app_market_calendar_page_actions_015nlcl.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_market_calendar_page_actions_015nlcl.js");
      case "server/chunks/ssr/app_market_layout_tsx_0nn-7f4._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_market_layout_tsx_0nn-7f4._.js");
      case "server/chunks/ssr/components_market_CalendarView_tsx_01cro1j._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_market_CalendarView_tsx_01cro1j._.js");
      case "server/chunks/ssr/node_modules_next_1iemwhs._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_1iemwhs._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1p56zky.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1p56zky.js");
      case "server/chunks/ssr/[root-of-the-server]__1s45j6l._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1s45j6l._.js");
      case "server/chunks/ssr/_next-internal_server_app_market_fxtin-news_page_actions_16d0x5l.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_market_fxtin-news_page_actions_16d0x5l.js");
      case "server/chunks/ssr/components_market_0gi_qlr._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_market_0gi_qlr._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1kcbaw7.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1kcbaw7.js");
      case "server/chunks/ssr/[root-of-the-server]__0vkmwzu._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0vkmwzu._.js");
      case "server/chunks/ssr/_07lam_2._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_07lam_2._.js");
      case "server/chunks/ssr/_next-internal_server_app_market_news_page_actions_18kqmss.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_market_news_page_actions_18kqmss.js");
      case "server/chunks/ssr/components_market_1a-jh6x._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_market_1a-jh6x._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0-wrk94.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0-wrk94.js");
      case "server/chunks/ssr/[root-of-the-server]__0eudh3h._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0eudh3h._.js");
      case "server/chunks/ssr/_next-internal_server_app_market_page_actions_0m7e3aq.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_market_page_actions_0m7e3aq.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_02_telk.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_02_telk.js");
      case "server/chunks/ssr/[root-of-the-server]__0enzg0w._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0enzg0w._.js");
      case "server/chunks/ssr/_next-internal_server_app_market_portfolio_page_actions_0ce745h.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_market_portfolio_page_actions_0ce745h.js");
      case "server/chunks/ssr/components_market_PortfolioClient_tsx_0c26mcc._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_market_PortfolioClient_tsx_0c26mcc._.js");
      case "server/chunks/ssr/components_ui_Modal_tsx_0fpxf8t._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_ui_Modal_tsx_0fpxf8t._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0yxlo--.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0yxlo--.js");
      case "server/chunks/ssr/[root-of-the-server]__198jrw2._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__198jrw2._.js");
      case "server/chunks/ssr/_1kag1-_._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1kag1-_._.js");
      case "server/chunks/ssr/_next-internal_server_app_market_prices_page_actions_1mcx4l8.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_market_prices_page_actions_1mcx4l8.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_16ed_-a.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_16ed_-a.js");
      case "server/chunks/ssr/[root-of-the-server]__1blgbsa._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1blgbsa._.js");
      case "server/chunks/ssr/_next-internal_server_app_page_actions_0hhsz1j.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_page_actions_0hhsz1j.js");
      case "server/chunks/ssr/components_home_1nmfb_9._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_home_1nmfb_9._.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_1m9dkk-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_1m9dkk-._.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_1zoha-h._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_1zoha-h._.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_search_mjs_047mxu6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_search_mjs_047mxu6._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_19fbxi_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_19fbxi_.js");
      case "server/chunks/ssr/[root-of-the-server]__0jtcip-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0jtcip-._.js");
      case "server/chunks/ssr/_next-internal_server_app_profile_page_actions_1b7qq3l.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_profile_page_actions_1b7qq3l.js");
      case "server/chunks/ssr/app_profile_page_tsx_1r7wvb6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_profile_page_tsx_1r7wvb6._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_080chkc.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_080chkc.js");
      case "server/chunks/[root-of-the-server]__0mnlnv0._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0mnlnv0._.js");
      case "server/chunks/_next-internal_server_app_rss_xml_route_actions_104a-jb.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_rss_xml_route_actions_104a-jb.js");
      case "server/chunks/ssr/[root-of-the-server]__1-odzch._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1-odzch._.js");
      case "server/chunks/ssr/_1m7zke5._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1m7zke5._.js");
      case "server/chunks/ssr/_1o-72hp._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1o-72hp._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_blog_new_page_actions_0l8d30m.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_blog_new_page_actions_0l8d30m.js");
      case "server/chunks/ssr/components_admin_BlogEditor_tsx_0a_4gte._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_admin_BlogEditor_tsx_0a_4gte._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1q9khp2.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1q9khp2.js");
      case "server/chunks/ssr/[root-of-the-server]__0fa2xi4._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0fa2xi4._.js");
      case "server/chunks/ssr/_011thaz._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_011thaz._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_blog_page_actions_03v7-8-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_blog_page_actions_03v7-8-.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1o6ni9q.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1o6ni9q.js");
      case "server/chunks/ssr/[root-of-the-server]__1_84ndx._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1_84ndx._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_blog_[id]_page_actions_0ty0_mq.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_blog_[id]_page_actions_0ty0_mq.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_09j0f22.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_09j0f22.js");
      case "server/chunks/ssr/[root-of-the-server]__1nc2kyu._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1nc2kyu._.js");
      case "server/chunks/ssr/_1v2m_y8._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1v2m_y8._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_bucket-list_page_actions_0dfxidq.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_bucket-list_page_actions_0dfxidq.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_042_un-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_042_un-.js");
      case "server/chunks/ssr/[root-of-the-server]__06b059a._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__06b059a._.js");
      case "server/chunks/ssr/_1jbv7x4._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1jbv7x4._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_categories_page_actions_1i7mcf0.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_categories_page_actions_1i7mcf0.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_104drwt.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_104drwt.js");
      case "server/chunks/ssr/[root-of-the-server]__0tovvog._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0tovvog._.js");
      case "server/chunks/ssr/_1me1qla._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1me1qla._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_focus_playlists_page_actions_04all6a.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_focus_playlists_page_actions_04all6a.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_09q92qj.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_09q92qj.js");
      case "server/chunks/ssr/[root-of-the-server]__092_8j0._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__092_8j0._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_focus_settings_page_actions_00_9kj8.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_focus_settings_page_actions_00_9kj8.js");
      case "server/chunks/ssr/app_tools_admin_focus_settings_page_tsx_1-b7a_v._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_tools_admin_focus_settings_page_tsx_1-b7a_v._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1m3noa2.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1m3noa2.js");
      case "server/chunks/ssr/[root-of-the-server]__20d2ykm._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__20d2ykm._.js");
      case "server/chunks/ssr/_1_s00xb._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1_s00xb._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_focus_sounds_page_actions_0j1vyly.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_focus_sounds_page_actions_0j1vyly.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_18us6n_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_18us6n_.js");
      case "server/chunks/ssr/[root-of-the-server]__14-zn3a._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__14-zn3a._.js");
      case "server/chunks/ssr/_12fnw8q._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_12fnw8q._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_focus_themes_page_actions_198o1u7.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_focus_themes_page_actions_198o1u7.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_19hwdon.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_19hwdon.js");
      case "server/chunks/ssr/1oeh_server_app_tools_admin_market_calendar-settings_page_actions_1-nmkw2.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/1oeh_server_app_tools_admin_market_calendar-settings_page_actions_1-nmkw2.js");
      case "server/chunks/ssr/[root-of-the-server]__18t4mga._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__18t4mga._.js");
      case "server/chunks/ssr/app_tools_admin_market_calendar-settings_page_tsx_15w5vod._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_tools_admin_market_calendar-settings_page_tsx_15w5vod._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1msf8zh.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1msf8zh.js");
      case "server/chunks/ssr/[root-of-the-server]__15mwmu8._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__15mwmu8._.js");
      case "server/chunks/ssr/_0h3aauw._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0h3aauw._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_market_news-sources_page_actions_01fsxvp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_market_news-sources_page_actions_01fsxvp.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1webmgk.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1webmgk.js");
      case "server/chunks/ssr/[root-of-the-server]__0fah-xx._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0fah-xx._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_market_portfolios_page_actions_1t461df.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_market_portfolios_page_actions_1t461df.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1grtgik.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1grtgik.js");
      case "server/chunks/ssr/[root-of-the-server]__0g6kr8r._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0g6kr8r._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_market_price-settings_page_actions_0siu6ns.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_market_price-settings_page_actions_0siu6ns.js");
      case "server/chunks/ssr/app_tools_admin_market_price-settings_page_tsx_0yz18t0._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_tools_admin_market_price-settings_page_tsx_0yz18t0._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0nkdntp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0nkdntp.js");
      case "server/chunks/ssr/[root-of-the-server]__1_tpc4s._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1_tpc4s._.js");
      case "server/chunks/ssr/_17woypz._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_17woypz._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_market_price-symbols_page_actions_1i9fo1_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_market_price-symbols_page_actions_1i9fo1_.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1b0k858.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1b0k858.js");
      case "server/chunks/ssr/[root-of-the-server]__0vvwn-c._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0vvwn-c._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_page_actions_10yqh-3.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_page_actions_10yqh-3.js");
      case "server/chunks/ssr/app_tools_admin_page_tsx_0msvhm8._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_tools_admin_page_tsx_0msvhm8._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1esys94.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1esys94.js");
      case "server/chunks/ssr/[root-of-the-server]__0rficg_._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rficg_._.js");
      case "server/chunks/ssr/_0ujruvy._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0ujruvy._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_tools_page_actions_0azthi4.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_tools_page_actions_0azthi4.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_03oq-8y.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_03oq-8y.js");
      case "server/chunks/ssr/[root-of-the-server]__0bbu44-._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0bbu44-._.js");
      case "server/chunks/ssr/_14_6p03._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_14_6p03._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_admin_users_page_actions_1mj3v1o.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_admin_users_page_actions_1mj3v1o.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1gaxonn.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1gaxonn.js");
      case "server/chunks/ssr/[root-of-the-server]__1n-pwuc._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1n-pwuc._.js");
      case "server/chunks/ssr/_1rbf_2j._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1rbf_2j._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_focus_habits_page_actions_200lakw.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_focus_habits_page_actions_200lakw.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1klvery.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1klvery.js");
      case "server/chunks/ssr/[root-of-the-server]__0z5onkv._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0z5onkv._.js");
      case "server/chunks/ssr/_21598pg._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_21598pg._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_focus_page_actions_17gz1c3.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_focus_page_actions_17gz1c3.js");
      case "server/chunks/ssr/app_tools_focus_page_tsx_1v7k59k._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/app_tools_focus_page_tsx_1v7k59k._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_12flmqu.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_12flmqu.js");
      case "server/chunks/ssr/[root-of-the-server]__1xh6blp._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1xh6blp._.js");
      case "server/chunks/ssr/_1c-ylal._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1c-ylal._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_focus_stats_page_actions_17830kc.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_focus_stats_page_actions_17830kc.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1-lq-v1.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1-lq-v1.js");
      case "server/chunks/ssr/[root-of-the-server]__1d0yyq7._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1d0yyq7._.js");
      case "server/chunks/ssr/_1u0qetg._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1u0qetg._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_shortlink_page_actions_1v3pbr_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_shortlink_page_actions_1v3pbr_.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1u1mwjs.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1u1mwjs.js");
      case "server/chunks/[root-of-the-server]__1xg02kj._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1xg02kj._.js");
      case "server/chunks/_next-internal_server_app_tools_shortlink_[code]_route_actions_1m063rp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_tools_shortlink_[code]_route_actions_1m063rp.js");
      case "server/chunks/ssr/[root-of-the-server]__215waoz._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__215waoz._.js");
      case "server/chunks/ssr/_0ccpggr._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0ccpggr._.js");
      case "server/chunks/ssr/_0gwul04._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0gwul04._.js");
      case "server/chunks/ssr/_0mt9io6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0mt9io6._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_base64_page_actions_0tavqf-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_base64_page_actions_0tavqf-.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_1yz6nac._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_1yz6nac._.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_16ohyws._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_16ohyws._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1ub3lo5.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1ub3lo5.js");
      case "server/chunks/ssr/[root-of-the-server]__04386a0._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__04386a0._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_category_[slug]_page_actions_0dghmg1.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_category_[slug]_page_actions_0dghmg1.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_19lth73._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_19lth73._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1b5r6ys.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1b5r6ys.js");
      case "server/chunks/ssr/[root-of-the-server]__1j06ubh._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1j06ubh._.js");
      case "server/chunks/ssr/_1s3onzz._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1s3onzz._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_cron-parser_page_actions_0qt9k4t.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_cron-parser_page_actions_0qt9k4t.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0bwd9gi.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0bwd9gi.js");
      case "server/chunks/ssr/[root-of-the-server]__1b78ilt._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1b78ilt._.js");
      case "server/chunks/ssr/_08k20li._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_08k20li._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_hash-generator_page_actions_1mk3bi4.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_hash-generator_page_actions_1mk3bi4.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1boanfu.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_1boanfu.js");
      case "server/chunks/ssr/[root-of-the-server]__07d71p6._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__07d71p6._.js");
      case "server/chunks/ssr/_0_8kreb._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0_8kreb._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_json-formatter_page_actions_1wc9x27.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_json-formatter_page_actions_1wc9x27.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0r91nhp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0r91nhp.js");
      case "server/chunks/ssr/[root-of-the-server]__140_e26._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__140_e26._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_page_actions_1gqtoj_.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_page_actions_1gqtoj_.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0d_2rp1.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0d_2rp1.js");
      case "server/chunks/ssr/[root-of-the-server]__13nqibm._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__13nqibm._.js");
      case "server/chunks/ssr/_0y3fuqv._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_0y3fuqv._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_password-generator_page_actions_11o93q8.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_password-generator_page_actions_11o93q8.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0x9fkby.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0x9fkby.js");
      case "server/chunks/ssr/[root-of-the-server]__1jrtu-f._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1jrtu-f._.js");
      case "server/chunks/ssr/_1qefk3z._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1qefk3z._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_url-encoder_page_actions_0cbbvfr.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_url-encoder_page_actions_0cbbvfr.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_03wbeg6.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_03wbeg6.js");
      case "server/chunks/ssr/[root-of-the-server]__1ztndzd._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1ztndzd._.js");
      case "server/chunks/ssr/_1on-l27._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_1on-l27._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_uuid-generator_page_actions_0xo0j3n.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_uuid-generator_page_actions_0xo0j3n.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0uc56g9.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0uc56g9.js");
      case "server/chunks/ssr/[root-of-the-server]__1-aza34._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1-aza34._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tools_[slug]_page_actions_1tfemoc.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tools_[slug]_page_actions_1tfemoc.js");
      case "server/chunks/ssr/components_toolbox_ToolShell_tsx_0ufnduv._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/components_toolbox_ToolShell_tsx_0ufnduv._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_003rkqp.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_003rkqp.js");
      case "server/chunks/ssr/[root-of-the-server]__0j820ik._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0j820ik._.js");
      case "server/chunks/ssr/[root-of-the-server]__1td3ra2._.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1td3ra2._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_13q04th.js": return require("C:/Source/core47/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_13q04th.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }


  async function loadWasmChunk(chunkPath) {
    switch (chunkPath) {

      default:
        throw new Error(`Unknown wasm chunk: ${chunkPath}`);
    }
  }
