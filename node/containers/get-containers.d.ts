import { Container } from "../container.js";
import { Loop } from "../loop/loop.js";
import { __X__ } from '../-x-.js';
/**
 *
 * @param containerDim
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, __X__[]>;
    containers: Container[];
};
export { getContainers };
