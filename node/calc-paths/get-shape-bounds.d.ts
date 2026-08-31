declare const getShapeBounds$: typeof getShapeBounds & {
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
declare function getShapeBounds(pss: number[][][]): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};
export { getShapeBounds, getShapeBounds$ };
