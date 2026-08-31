import type { Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
declare const completePaths: ((this: unknown, expMax: number, minYContainers: Container[]) => Out) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { completePaths };
