import type { Loop } from "./loop.js";
/**
 * Returns the signed winding number weighted area of the given shape.
 *
 * * also useful for finding the orientation of loops
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
declare const getShapeArea$: ((shape: number[][][]) => number) & {
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
/**
 * @deprecated This function is deprecated. Use `getShapeArea` instead.
 *
 * Returns the area of the given Loop.
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 */
declare function getLoopArea(loop: Loop): number;
export { getLoopArea, getShapeArea$ };
/**
 * THIS FUNCTION WAS REPLACED BY A MORE ACCURATE ONE
 *
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
