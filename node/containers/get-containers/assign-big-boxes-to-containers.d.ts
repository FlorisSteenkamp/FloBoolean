import type { Container, ContainerBasic } from "../container.js";
declare const assignBigBoxesToContainers: ((this: unknown, containers: ContainerBasic[], expMax: number) => Container[]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { assignBigBoxesToContainers };
