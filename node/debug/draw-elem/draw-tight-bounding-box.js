import { drawFs } from 'flo-draw';
/** @hidden */
function drawTightBoundingBox(g, box, classes = 'thin5 pinker nofill', delay = 0) {
    let $box = drawFs.polygon(g, box, classes, delay);
    return $box;
}
export { drawTightBoundingBox };
//# sourceMappingURL=draw-tight-bounding-box.js.map