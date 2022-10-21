import { Container } from "../container.js";
import { __X__ } from "../-x-.js";
import { Loop } from "../loop/loop.js";
/**
 *
 * @param containerDim
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, __X__[]>;
    containers: Container[];
};
export { getContainers };
