import type { Container } from "./container.js";
/**
 * Orders the `InOut`s within the container in a loop.
 *
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 *
 * @param container
 */
declare const orderInOuts: ((this: unknown, container: Container) => void) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { orderInOuts };
