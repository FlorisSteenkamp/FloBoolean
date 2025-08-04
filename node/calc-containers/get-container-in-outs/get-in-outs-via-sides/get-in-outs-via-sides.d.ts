import { Container } from "../../../container";
import { InOut } from "../../../in-out";
/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container
 * using an extremely small rectangle around the intersections.
 * * **warning** ioIdx will be modified by this function
 * @param container
 * @param ioIdx
 */
declare function getInOutsViaSides(container: Container, ioIdx: number): {
    inOuts: InOut[];
    ioIdx: number;
};
export { getInOutsViaSides };
