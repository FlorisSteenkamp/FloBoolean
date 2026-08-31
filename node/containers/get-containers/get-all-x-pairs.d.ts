import type { Loop } from "../../shape/loop.js";
import type { X } from "../../get-critical-points/x.js";
declare const getIntersections_: ((this: unknown, loops: Loop[]) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
declare const getSelfIntersections_: ((this: unknown, loops: Loop[]) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
declare const getInterfaceIntersections_: ((this: unknown, loops: Loop[]) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
declare const getExcessiveCurvatures_: ((this: unknown, expMax: number, loops: Loop[]) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
declare const getTurnarounds_: ((this: unknown, loops: Loop[]) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
/**
 * Returns intersections of all types on the given `loops`
 */
declare const getAllXPairs: ((this: unknown, loops: Loop[], minYXPairs: X[], expMax: number) => [X, X][]) & {
    getStats: () => {
        count: number;
        totalMs: number;
    };
    resetStats: () => void;
};
export { getAllXPairs, getIntersections_, getSelfIntersections_, getInterfaceIntersections_, getExcessiveCurvatures_, getTurnarounds_, };
