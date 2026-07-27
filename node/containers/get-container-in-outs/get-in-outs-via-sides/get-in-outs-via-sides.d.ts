import type { InOut } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
/**
 * Returns the incoming / outgoing curves (as `InOuts`) for the given container
 * using an extremely small rectangle around the intersections.
 *
 * * **warning** `ioIdx` will be modified by this function
 *
 * @param container
 * @param ioIdx
 */
declare const getInOutsOfContainer: ((this: unknown, container: Container) => InOut[]) & {
    getStats: () => {
        count: number;
        totalMs: number;
        avg: number;
    };
    resetStats: () => void;
};
export { getInOutsOfContainer };
