"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
/** @hidden */
function drawBoundingHull(g, hull, classes = 'thin5 black nofill', delay = 0) {
    let $polygon = flo_draw_1.drawFs.polygon(g, hull, classes, delay);
    return $polygon;
}
exports.drawBoundingHull = drawBoundingHull;
//# sourceMappingURL=draw-bounding-hull.js.map