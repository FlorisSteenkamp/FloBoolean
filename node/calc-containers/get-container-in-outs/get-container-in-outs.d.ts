import { Container } from "../../container";
/**
 * * **warning** ioIdx will be modified by this function
 * @param container
 * @param ioIdx
 */
declare function getContainerInOuts(container: Container, ioIdx: number): {
    inOuts: import("../../in-out").InOut[];
    ioIdx: number;
};
export { getContainerInOuts };
