import { Container } from './container';
import { InOut } from './in-out';
import { Curve } from './curve/curve';
import { X } from 'flo-bezier3';
/**
 * Representation of one side of an intersection.
 */
interface _X_ {
    x: X;
    container?: Container;
    /** The Curve on the shape boundary this point belong to. */
    curve: Curve;
    /**
     * The next intersection along the original loop that this X belongs to
     */
    next?: _X_;
    in_?: InOut;
}
export { _X_ };
