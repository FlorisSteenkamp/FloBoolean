import { Container } from "../container";
import { _X_ } from "../x";
import { Loop } from "../loop/loop";
/**
 *
 * @param containerDim
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, _X_[]>;
    containers: Container[];
};
export { getContainers };
