"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function drawLooseBoundingBox(g, box, classes = 'thin5 brown nofill', delay = 0) {
    let [[x0, y0], [x1, y1]] = box;
    box = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    let $box = flo_draw_1.drawFs.polygon(g, box, classes, delay);
    return $box;
}
exports.drawLooseBoundingBox = drawLooseBoundingBox;
//# sourceMappingURL=draw-loose-bounding-box.js.map