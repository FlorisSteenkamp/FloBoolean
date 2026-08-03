import type { Loop } from "./loop.js";
/**
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function getShapeArea(shape: (number[][])[]): number;
/**
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function ddGetShapeArea(shape: (number[][])[]): number[];
/**
 * @deprecated This function is deprecated. Use `getShapeArea` instead.
 *
 * Returns the area of the given Loop.
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 */
declare function getLoopArea(loop: Loop): number;
export { getLoopArea, getShapeArea, ddGetShapeArea };
