"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawTightBoundingBox = void 0;
const flo_draw_1 = require("flo-draw");
/** @hidden */
function drawTightBoundingBox(g, box, classes = 'thin5 pinker nofill', delay = 0) {
    let $box = flo_draw_1.drawFs.polygon(g, box, classes, delay);
    return $box;
}
exports.drawTightBoundingBox = drawTightBoundingBox;
//# sourceMappingURL=draw-tight-bounding-box.js.map