import { Loop } from './loop';
/**
 *
 */
declare let getMinY: (a: Loop) => {
    curve: import("../curve/curve").Curve;
    y: {
        ts: number[];
        box: number[][];
    };
};
export { getMinY };
