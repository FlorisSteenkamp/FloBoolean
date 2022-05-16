import { drawFs } from 'flo-draw';
/** @hidden */
function drawBoundingHull(g, hull, classes = 'thin5 black nofill', delay = 0) {
    let $polygon = drawFs.polygon(g, hull, classes, delay);
    return $polygon;
}
export { drawBoundingHull };
//# sourceMappingURL=draw-bounding-hull.js.map