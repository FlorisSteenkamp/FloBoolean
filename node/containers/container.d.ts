import type { __X__ } from "../get-critical-points/-x-.js";
import type { InOut } from "./in-out/in-out.js";
/**
 * Representation of a a small rectangular box containing close intersections.
 * All contained intersections are 'far' from the box's sides.
 */
interface Container {
    /** the box enclosing the intersections */
    readonly box: number[][];
    /** an array of enclosed intersections */
    readonly xs: __X__[];
    /**
     * ordered array of incoming / outgoing curves where the order is
     * anti-clockwise from the top right (minimum y, maximum x) corner
     */
    readonly inOuts: InOut[];
}
/**
 * Returns true if the container contains only 1 interface
 * intersection or contains only 1 general, extreme or loop intersection
 * (not cusp, or endpoint overlap), false otherwise.
 *
 * @param container
 */
declare function containerIsBasic(container: Container): boolean;
export type { Container };
export { containerIsBasic };
