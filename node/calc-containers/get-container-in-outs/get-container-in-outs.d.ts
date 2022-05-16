import { Container } from "../../container.js";
/**
 * * **warning** ioIdx will be modified by this function
 * @param container
 * @param ioIdx
 */
declare function getContainerInOuts(container: Container, ioIdx: number): {
    inOuts: import("../../in-out.js").InOut[];
    ioIdx: number;
};
export { getContainerInOuts };
