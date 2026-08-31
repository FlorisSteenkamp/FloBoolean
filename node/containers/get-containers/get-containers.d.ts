import type { Container } from "../container.js";
import type { X } from '../../get-critical-points/x.js';
/**
 *
 * @param containerDim
 *
 * @internal
 */
declare const getContainers: ((this: unknown, xPairs: [X, X][], expMax: number, expContainer: number) => Container[]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { getContainers };
