"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draw_min_y_1 = require("./draw-min-y");
const draw_loop_1 = require("./draw-loop");
const draw_loops_1 = require("./draw-loops");
const draw_intersection_1 = require("./draw-intersection");
const draw_container_1 = require("./draw-container");
const draw_loose_bounding_box_1 = require("./draw-loose-bounding-box");
const draw_tight_bounding_box_1 = require("./draw-tight-bounding-box");
const draw_bounding_hull_1 = require("./draw-bounding-hull");
const flo_draw_1 = require("flo-draw");
let drawElemFunctions = {
    minY: draw_min_y_1.drawMinY,
    loop: draw_loop_1.drawLoop,
    loops: draw_loops_1.drawLoops,
    intersection: draw_intersection_1.drawIntersection,
    container: draw_container_1.drawContainer,
    bezier_: flo_draw_1.drawFs.bezier,
    looseBoundingBox_: draw_loose_bounding_box_1.drawLooseBoundingBox,
    tightBoundingBox_: draw_tight_bounding_box_1.drawTightBoundingBox,
    boundingHull_: draw_bounding_hull_1.drawBoundingHull
};
exports.drawElemFunctions = drawElemFunctions;
//# sourceMappingURL=draw-elem.js.map