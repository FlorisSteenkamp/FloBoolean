"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoopCentroid = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const flo_gauss_quadrature_1 = require("flo-gauss-quadrature");
const flo_poly_1 = require("flo-poly");
const get_loop_area_1 = require("./get-loop-area");
/**
 * Returns the approximate centroid of the given loop
 * * **precondition**: loop must be a jordan curve (i.e. closed and simple)
 * see https://sites.math.washington.edu/~king/coursedir/m324a10/as/centroid-green.pdf
 */
function getLoopCentroid(loop) {
    let A = get_loop_area_1.getLoopArea(loop);
    let cx = 0;
    let cy = 0;
    for (let curve of loop.curves) {
        let ps = curve.ps;
        let x = flo_bezier3_1.getX(ps);
        let y = flo_bezier3_1.getY(ps);
        let dx = flo_bezier3_1.getDx(ps);
        let dy = flo_bezier3_1.getDy(ps);
        let _x = flo_gauss_quadrature_1.gaussQuadrature(evaluateIntergral([x, x, dy]), [0, 1], 16);
        let _y = flo_gauss_quadrature_1.gaussQuadrature(evaluateIntergral([y, y, dx]), [0, 1], 16);
        cx += _x;
        cy += _y;
    }
    let a = 1 / (2 * A);
    return [-a * cx, a * cy];
}
exports.getLoopCentroid = getLoopCentroid;
function evaluateIntergral(polys) {
    return (t) => flo_poly_1.evaluate(polys[0], t) *
        flo_poly_1.evaluate(polys[1], t) *
        flo_poly_1.evaluate(polys[2], t);
}
//# sourceMappingURL=get-loop-centroid.js.map