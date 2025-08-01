import { __X__ } from "./-x-";
import { InOut } from "./in-out";


/**
 * Representation of a a small rectangular box containing close intersections.
 * All contained intersections are 'far' from the box's sides.
 */
interface Container {
    /** the box enclosing the intersections */
    box: number[][];
    /** an array of enclosed intersections */
    xs: __X__[];
    /** 
     * ordered array of incoming / outgoing curves where the order is 
     * anti-clockwise from the top right (minimum y, maximum x) corner
     */
    inOuts: InOut[];
}


/**
 * Returns true if the container contains only 1 interface 
 * intersection or contains only 1 general, extreme or loop intersection
 * (not cusp, or endpoint overlap), false otherwise.
 * 
 * @param container 
 */
function containerIsBasic(container: Container) {
    const xs = container.xs;
    // xs.length;//?

    if (xs.length <= 2 && xs[0].x.kind !== 7) { return true; }

    // xs.length;//?

    return false;
}


export { Container, containerIsBasic }
