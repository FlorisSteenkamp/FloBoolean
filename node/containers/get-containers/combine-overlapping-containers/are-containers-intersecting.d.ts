import type { ContainerBasic } from "../../container.js";
/** Fraction of its own width/height by which a container box is grown on every
 * side before testing for overlap when deciding whether to merge containers. */
declare const CONTAINER_MERGE_ENLARGE_FRAC = 0.5;
/**
 * Enlarges an axis-aligned box by `frac` of its size on every side (e.g.
 * `frac === 0.5` grows each side by 50% of the box's width/height).
 */
declare function enlargeBox(box: number[][], frac: number): number[][];
declare function areContainersIntersecting(container1: ContainerBasic, container2: ContainerBasic): boolean;
export { areContainersIntersecting, enlargeBox, CONTAINER_MERGE_ENLARGE_FRAC };
