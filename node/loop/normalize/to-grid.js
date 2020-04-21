"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_numerical_1 = require("flo-numerical");
/**
 * Sends a onto a fixed-spacing grid with 2**significantFigures divisions. Each
 * division is 2**maxExp / 2**significantFigures wide.
 * @param a
 * @param expMax log2(max extent of grid in positive and negative directions)
 *
 * @param significantFigures
 */
function toGrid(a, expMax, significantFigures) {
    let expA = Math.floor(Math.log2(Math.abs(a)));
    let expDif = expMax - expA;
    let newSig = significantFigures - expDif + 1;
    if (newSig <= 0) {
        return 0;
    }
    if (significantFigures >= 53) {
        return a;
    }
    return flo_numerical_1.reduceSignificand(a, newSig);
}
exports.toGrid = toGrid;
//# sourceMappingURL=to-grid.js.map