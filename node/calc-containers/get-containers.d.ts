import { Container } from "../container.js";
import { Loop } from "../loop/loop.js";
/**
 *
 * @param containerDim
 */
declare function getContainers(loops: Loop[], containerDim: number, expMax: number): {
    extremes: Map<Loop, import("../-x-.js").__X__[]>;
    containers: Container[];
};
export { getContainers };
