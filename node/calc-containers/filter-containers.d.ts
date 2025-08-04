import { Container } from "../container.js";
/**
 * Returns the containers that is the given containers filtered so that those
 * having only interface intersections or only a single (given as a pair) even
 * multiple intersection are not included.
 * @param containers
 */
declare function filterContainers(containers: Container[]): Container[];
export { filterContainers };
