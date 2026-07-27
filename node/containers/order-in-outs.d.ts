import type { Container } from "./container.js";
/**
 * Orders the `InOut`s within the container in a loop.
 *
 * * modifies `prevAround` and `nextAround` of the given container's `InOut`s
 *
 * @param container
 */
declare function orderInOuts(container: Container, snugDir: number): void;
export { orderInOuts };
