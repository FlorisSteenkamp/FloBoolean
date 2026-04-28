import type { Loop } from './loop.js';
/**
 *
 */
declare const getMinY: ((loop: Loop) => {
    curve: import("../index.js").Curve;
    y: import("flo-bezier3").Bound;
}) & {
    readonly weakMapS: WeakMap<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly mapS: Map<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly clearCache: () => void;
    readonly addToCache: (r: unknown, ...args: any) => void;
};
export { getMinY };
