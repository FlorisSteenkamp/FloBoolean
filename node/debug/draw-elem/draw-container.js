"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawContainer = void 0;
const flo_draw_1 = require("flo-draw");
function drawContainer(g, container, classes, delay = 0) {
    let rect = container.box;
    let xs = container.xs;
    let scale = 0.025;
    // intersections
    let $circles = [];
    for (let i = 0; i < xs.length; i++) {
        let x = xs[i];
        $circles.push(...flo_draw_1.drawFs.circle(g, { center: x.x.box[0], radius: scale }, 'thin2 red nofill', delay));
    }
    // text showing intersection ordering
    let $texts = [];
    let inOuts = container.inOuts;
    for (let i = 0; i < inOuts.length; i++) {
        let inOut = inOuts[i];
        let C = 3;
        let p = inOut.p.slice();
        //if (inOut.order) {
        //    if (inOut.order[0] === 3) { p[0] += C; }
        //    if (inOut.order[0] === 0) { p[1] -= C; }
        //    if (inOut.order[0] === 1) { p[0] -= 2*C; }
        //    if (inOut.order[0] === 2) { p[1] += 2*C; }
        //}
        let color = inOut.dir === -1 ? 'red' : 'blue';
        //let size = scale * (inOut.dir === -1 ? 0.75 : 1);
        let size = scale * (inOut.dir === -1 ? 0.5 : 0.5);
        //$texts.push(...drawFs.text(g, p, i.toString(), 4, color, delay));
        $circles.push(...flo_draw_1.drawFs.dot(g, inOut.p, size, `thin2 ${color}`, delay));
    }
    // container rect
    let $outline = flo_draw_1.drawFs.rect(g, rect, 'thin2 blue nofill', delay);
    return [...$outline, ...$circles, ...$texts];
}
exports.drawContainer = drawContainer;
//# sourceMappingURL=draw-container.js.map