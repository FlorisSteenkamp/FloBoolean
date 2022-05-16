import { _X_ } from "./-x-.js";
import { InOut } from "./in-out.js";


/**
 * Representation of a a small rectangular box containing close intersections.
 * All contained intersections are 'far' from the box's sides.
 */
interface Container {
    /** the box enclosing the intersections */
    box: number[][];
    /** an array of enclosed intersections */
    xs: _X_[];
    /** 
     * ordered array of incoming / outgoing curves where the order is 
     * anti-clockwise from the top right (minimum y, maximum x) corner
     */
    inOuts: InOut[];
}


/**
 * Returns true if the container is basic, i.e. contains only 1 interface 
 * intersection or contains only 1 general, extreme or loop intersection
 * (not cusp, or endpoint overlap), false otherwise.
 * 
 * @param container 
 */
function containerIsBasic(expMax: number, container: Container) {
    let xs = container.xs;

    if (xs.length <= 2) { return true; }

    return false;
}


export { Container, containerIsBasic }
