import { Container } from "../../../container";
import { InOut } from "../../../in-out";
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
