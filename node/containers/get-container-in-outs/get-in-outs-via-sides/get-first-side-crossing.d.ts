import type { _X_ } from "../../../get-critical-points/-x-.js";
import { SideCrossing } from './side-crossing.js';
/**
 * Follows the loop's beziers outward from `_x_` (via `iterBeziersToNextX`) and
 * returns the first `side` (index into `sides`) whose segment is crossed by a
 * bezier piece's endpoint segment, together with the crossing point `p`, or
 * `undefined` if no crossing occurs before the next intersection.
 *
 * The `sides` are the axis-aligned edges of a box in the standard side order
 * (0 top, 1 left, 2 bottom, 3 right).
 */
declare const getFirstSideCrossing$: ((_x_: _X_, sides: number[][][], forward: boolean, sideIdxs: number[]) => SideCrossing) & {
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
export { getFirstSideCrossing$ };
