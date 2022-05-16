import { type X } from './x.js';
import { Container } from './container.js';
import { InOut } from './in-out.js';
import { Curve } from './curve/curve.js';
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
