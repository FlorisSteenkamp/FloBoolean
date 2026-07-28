import type { Loop } from './loop.js';
/**
 *
 */
declare function getMinY(loop: Loop): {
    curve: import("../index.js").Curve;
    y: {
        t: number;
        p: number[];
    };
};
export { getMinY };
