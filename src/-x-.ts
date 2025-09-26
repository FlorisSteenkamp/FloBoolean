import type { X } from './x.js';
import type { Container } from './container.js';
import type { InOut } from './containers/in-out/in-out.js';
import type { Curve } from './curve/curve.js';


/** 
 * Representation of one side of an intersection.
 */
interface _X_ {
    readonly x: X;
    /** The Curve on the shape boundary this point belong to. */
    readonly curve: Curve;
}


/** 
 * Representation of one side of an intersection.
 */
interface __X__ extends _X_ {
    readonly container?: Container;
    /** 
     * The next intersection along the original loop that this X belongs to
     */
    readonly next?: __X__;
    readonly prev?: __X__;
    readonly in_?: InOut;
    readonly out?: InOut;
}


export type { _X_, __X__ }
