import { drawFs } from 'flo-draw';
/** @internal */
function drawBoundingHull(g, hull, classes = 'thin5 black nofill', delay = 0) {
    const $polygon = drawFs.polygon(g, hull, classes, delay);
    return $polygon;
}
export { drawBoundingHull };
//# sourceMappingURL=draw-bounding-hull.js.map