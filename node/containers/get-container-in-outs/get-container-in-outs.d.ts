import { Container } from "../../container.js";
import { InOut } from "../../containers/in-out/in-out.js";
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
