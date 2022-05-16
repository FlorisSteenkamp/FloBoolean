import { Container } from "../container.js";
import { _X_ } from "../-x-.js";
import { Loop } from "../loop/loop.js";
/**
 *
 * @param containerDim
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, _X_[]>;
    containers: Container[];
};
export { getContainers };
