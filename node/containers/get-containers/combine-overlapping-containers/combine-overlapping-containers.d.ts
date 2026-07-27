import type { Container } from "../../container.js";
/**
 * Returns new `containers` by iterating, combining containers that overlap on
 * each iteration
 *
 * @param containers
 */
declare function combineOverlappingContainers(containers: Container[]): Container[];
export { combineOverlappingContainers };
