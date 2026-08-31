import type { ContainerBasic } from "../../container.js";
/**
 * Returns new `containers` by iterating, combining containers that overlap on
 * each iteration
 *
 * @param containers
 */
declare const combineOverlappingContainers: ((this: unknown, containers: ContainerBasic[]) => ContainerBasic[]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { combineOverlappingContainers };
