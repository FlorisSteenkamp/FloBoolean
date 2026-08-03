import type { Container } from "../container.js";
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Loop } from "../../shape/loop.js";
/**
 *
 * @param containerDim
 *
 * @internal
 */
declare function getContainers(loops: Loop[], minYXPairs: [_X_, _X_][], expMax: number): Container[];
export { getContainers };
