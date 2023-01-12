import { drawFs } from "flo-draw";
/** @internal */
function drawLooseBoundingBox(g, box, classes = 'thin5 brown nofill', delay = 0) {
    const [[x0, y0], [x1, y1]] = box;
    box = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    const $box = drawFs.polygon(g, box, classes, delay);
    return $box;
}
export { drawLooseBoundingBox };
//# sourceMappingURL=draw-loose-bounding-box.js.map