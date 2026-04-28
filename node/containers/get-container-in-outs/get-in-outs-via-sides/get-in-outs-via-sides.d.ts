import type { InOut } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../../container.js";
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
