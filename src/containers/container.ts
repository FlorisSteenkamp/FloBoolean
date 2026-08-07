import type { _X_ } from "../get-critical-points/-x-.js";
import type { InOut } from "./in-out/in-out.js";


/**
 * Representation of a a small rectangular box containing close intersections.
 * All contained intersections are 'far' from the box's sides.
 */
interface Container {
    /** the box enclosing the intersections */
    readonly box: number[][];
    readonly bigBox: number[][];
    /** an array of enclosed intersections */
    readonly xs: _X_[];
    /** 
     * ordered array of incoming / outgoing curves where the order is 
     * anti-clockwise from the top right (minimum y, maximum x) corner
     */
    readonly inOuts: InOut[];
}


export type { Container }
