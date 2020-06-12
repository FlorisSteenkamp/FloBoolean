"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areContainersIntersecting = void 0;
const are_boxes_intersecting_1 = require("../sweep-line/are-boxes-intersecting");
function areContainersIntersecting(container1, container2) {
    return are_boxes_intersecting_1.areBoxesIntersecting(true)(container1.box, container2.box);
}
exports.areContainersIntersecting = areContainersIntersecting;
//# sourceMappingURL=are-containers-intersecting.js.map