"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_extreme_1 = require("./get-extreme");
// TODO - include all interface points close to the extreme - they are the only
// important interface points - or are they??
/**
 *
 * @param loops
 */
function getExtremes(loops) {
    let extremes = new Map();
    let xs = [];
    for (let loop of loops) {
        let xPair = get_extreme_1.getExtreme(loop);
        xs.push(xPair);
        extremes.set(loop, xPair);
    }
    return { extremes, xs };
}
exports.getExtremes = getExtremes;
//# sourceMappingURL=get-extremes.js.map