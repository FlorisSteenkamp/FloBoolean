/**
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
declare const getMaxCoordinate: ((loops: number[][][][]) => number) & {
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
export { getMaxCoordinate };
