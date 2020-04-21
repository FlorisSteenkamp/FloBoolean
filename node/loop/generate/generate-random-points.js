"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_poly_1 = require("flo-poly");
/**
 * Returns a specified number of random integer-coordinate points within a given
 * range
 * @param n the number of points to generate
 * @param width the range of the x-y values -> [-width, +width]
 * @param SEED a random seed
 */
function generateRandomPoints(n, width, SEED) {
    // get random values in [-width,+width]
    let randoms1 = flo_poly_1.flatCoefficients(2 * n, -width, +width, SEED);
    let vs = randoms1.p.map(Math.round);
    let ps = [];
    for (let i = 0; i < n; i++) {
        ps.push([vs[i * 2], vs[i * 2 + 1]]);
    }
    return ps;
}
exports.generateRandomPoints = generateRandomPoints;
//# sourceMappingURL=generate-random-points.js.map