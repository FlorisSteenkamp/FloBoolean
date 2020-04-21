"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draw_circle_percent_1 = require("./draw-circle-percent");
function drawIntersection(g, x) {
    return [draw_circle_percent_1.drawCirclePercent(g, x.x.box[0], 0.7, 'purple thin5 nofill')];
}
exports.drawIntersection = drawIntersection;
//# sourceMappingURL=draw-intersection.js.map