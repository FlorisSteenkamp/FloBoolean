import type { Container } from "../container.js";
import type { __X__ } from '../../get-critical-points/-x-.js';
import type { Loop } from "../../loop/loop.js";
/**
 *
 * @param containerDim
 *
 * @internal
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, [__X__, __X__]>;
    containers: Container[];
};
export { getContainers };
