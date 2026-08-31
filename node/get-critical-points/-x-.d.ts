import type { X } from './x.js';
import type { Container } from '../containers/container.js';
import type { In, Out } from '../containers/in-out/in-out.js';
/**
 * Representation of one side of an intersection.
 */
interface _X_ {
    readonly x: X;
    readonly container: Container;
    /**
     * The next intersection along the original loop that this X belongs to
     */
    readonly next: _X_;
    readonly prev: _X_;
    readonly in_?: In | undefined;
    readonly out?: Out | undefined;
}
export type { _X_ };
