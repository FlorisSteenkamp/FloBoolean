import type { _X_ } from "../get-critical-points/-x-.js";
import type { In, Out } from "./in-out/in-out.js";


/**
 * Represents a a small rectangular box containing (and thus grouping) intersections.
 * 
 * * all contained intersections are 'far' from the box's sides.
 */
interface ContainerBasic {
    /** an array of enclosed intersections */
    readonly xs: _X_[];
    /** the box enclosing (and thus grouping) the intersections */
    readonly box: number[][];
}


/**
 * Represents a a small rectangular box containing (and thus grouping) intersections.
 * 
 * * all contained intersections are 'far' from the box's sides.
 */
interface Container extends ContainerBasic {
    /** the box used to order `InOut`s */
    readonly bigBox: number[][];
    /** 
     * ordered array of incoming / outgoing curves where the order is 
     * anti-clockwise from the top right (minimum y, maximum x) corner
     */
    readonly inOuts: (In|Out)[];
    readonly idx?: number;
}


export type { ContainerBasic, Container }
