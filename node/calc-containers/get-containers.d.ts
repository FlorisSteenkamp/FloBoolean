import { Container } from "../container";
import { Loop } from "../loop/loop";
/**
 *
 * @param containerDim
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, import("../-x-").__X__[]>;
    containers: Container[];
};
export { getContainers };
