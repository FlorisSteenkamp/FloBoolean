import type { Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
/**
 * Completes the path of a disjoint set of loops, i.e. this function is called
 * for each disjoint set of paths.
 *
 * @param initialOut
 * @param takenOuts
 * @param takenContainers
 */
declare function completePath(initialOut: Out, takenOuts: Set<Out>, takenContainers: Set<Container>): void;
export { completePath };
