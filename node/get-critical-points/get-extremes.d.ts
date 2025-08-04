import type { Loop } from "../loop/loop.js";
import type { __X__ } from "../-x-.js";
/**
 *
 * @param loops
 */
declare function getExtremes(loops: Loop[]): {
    extremes: Map<Loop, __X__[]>;
    xs: __X__[][];
};
export { getExtremes };
