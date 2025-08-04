import { Container } from "../../container";
import { InOut } from "../../in-out";
/**
 * * **warning** ioIdx will be modified by this function
 *
 * @param container
 * @param ioIdx
 */
declare function getContainerInOuts(container: Container, ioIdx: number): {
    inOuts: InOut[];
    ioIdx: number;
};
export { getContainerInOuts };
