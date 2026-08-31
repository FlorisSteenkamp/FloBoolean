import type { Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
/**
 * Completes a loop for a specific intersection point entry curve.
 *
 * @param takenOuts
 * @param takenContainers
 * @param origOut
 */
declare const completeLoop: ((this: unknown, takenOuts: Set<Out>, takenContainers: Set<Container>, origOut: Out) => Out[]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { completeLoop };
