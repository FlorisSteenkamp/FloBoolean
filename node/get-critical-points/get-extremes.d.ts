import { Loop } from "../loop/loop";
import { _X_ } from "../x";
/**
 *
 * @param loops
 */
declare function getExtremes(loops: Loop[]): {
    extremes: Map<Loop, _X_[]>;
    xs: _X_[][];
};
export { getExtremes };
