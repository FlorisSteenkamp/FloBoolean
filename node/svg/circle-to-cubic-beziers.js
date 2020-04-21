"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C = 0.551915024494;
/**
 *
 * @param center
 * @param radiusX
 * @param radiusY
 * @param rotation in degrees
 * @param clockwise
 */
function circleToCubicBeziers(center = [0, 0], radiusX, radiusY, rotation, clockwise = false) {
    let pss = [
        [[0, 1], [C, 1], [1, C], [1, 0]],
        [[1, 0], [1, -C], [C, -1], [0, -1]],
        [[0, -1], [-C, -1], [-1, -C], [-1, 0]],
        [[-1, 0], [-1, C], [-C, 1], [0, 1]]
    ];
    pss = pss.map(ps => ps.map(applyMatrix([
        [radiusX, 0],
        [0, radiusY]
    ])));
    pss = pss.map(ps => ps.map(rotateDegrees(rotation)));
    pss = pss.map(ps => ps.map(translate(center)));
    if (!clockwise) {
        return pss;
    }
    return (pss.map(ps => ps.slice().reverse()).slice().reverse());
}
exports.circleToCubicBeziers = circleToCubicBeziers;
function rotateDegrees(θ) {
    return (p) => {
        return rotateRad(degToRad(θ), p);
    };
}
function rotateRad(θ, p) {
    let cosθ = Math.cos(θ);
    let sinθ = Math.sin(θ);
    let M = [
        [cosθ, -sinθ],
        [sinθ, cosθ]
    ];
    return applyMatrix(M)(p);
}
function applyMatrix(M) {
    return (p) => {
        return [
            M[0][0] * p[0] + M[0][1] * p[1],
            M[1][0] * p[0] + M[1][1] * p[1]
        ];
    };
}
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
function radToDeg(deg) {
    return deg * (180 / Math.PI);
}
function translate(v) {
    return (p) => {
        return [p[0] + v[0], p[1] + v[1]];
    };
}
//# sourceMappingURL=circle-to-cubic-beziers.js.map