import type { Loop } from './loop.js';
/**
 *
 */
declare function getLoopMinY(loop: Loop): {
    curve: import("../index.js").Curve;
    y: {
        t: number;
        p: number[];
    };
};
export { getLoopMinY };
