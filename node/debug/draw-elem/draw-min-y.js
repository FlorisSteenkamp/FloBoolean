"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawMinY = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const flo_draw_1 = require("flo-draw");
function drawMinY(g, pos) {
    let p = flo_bezier3_1.evalDeCasteljau(pos.curve.ps, pos.t);
    let ps = flo_bezier3_1.toCubic(pos.curve.ps);
    console.log('x: ', flo_bezier3_1.getX(ps));
    console.log('y: ', flo_bezier3_1.getY(ps));
    console.log('t: ', pos.t);
    let $elems = flo_draw_1.drawFs.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
exports.drawMinY = drawMinY;
//# sourceMappingURL=draw-min-y.js.map