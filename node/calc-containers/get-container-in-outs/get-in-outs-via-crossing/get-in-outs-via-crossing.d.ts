import { Container } from "../../../container.js";
import { InOut } from "../../../in-out.js";
/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container.
 * @param container
 * @param ioIdx
 */
declare function getInOutsViaCrossing(container: Container, ioIdx: number): {
    inOuts: InOut[];
    ioIdx: number;
};
export { getInOutsViaCrossing };
