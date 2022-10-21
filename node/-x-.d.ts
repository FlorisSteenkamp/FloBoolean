import { type X } from './x.js';
import { Container } from './container.js';
import { InOut } from './in-out.js';
import { Curve } from './curve/curve.js';
/**
 * Representation of one side of an intersection.
 */
interface _X_ {
    x: X;
    /** The Curve on the shape boundary this point belong to. */
    curve: Curve;
}
/**
 * Representation of one side of an intersection.
 */
interface __X__ extends _X_ {
    container?: Container;
    /**
     * The next intersection along the original loop that this X belongs to
     */
    next?: __X__;
    in_?: InOut;
}
export { _X_, __X__ };
