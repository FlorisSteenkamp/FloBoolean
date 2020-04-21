"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
/**
 * Returns the maximum control point coordinate value (x or y) within any loop.
 * @param loops The array of loops
 */
let getMaxCoordinate = flo_memoize_1.memoize((loops) => {
    let max = 0;
    for (let loop of loops) {
        for (let ps of loop) {
            for (let p of ps) {
                for (let c of p) {
                    let c_ = Math.abs(c);
                    if (c_ > max) {
                        max = c_;
                    }
                }
            }
        }
    }
    return max;
});
exports.getMaxCoordinate = getMaxCoordinate;
//# sourceMappingURL=get-max-coordinate.js.map