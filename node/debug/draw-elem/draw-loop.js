import { drawFs } from 'flo-draw';
// import { getLoopArea, getShapeArea } from '../../loop/get-loop-area.js';
import { getShapeCentroid } from '../../loop/get-loop-centroid.js';
// import { getShapeBounds } from '../../loop/get-loop-bounds.js';
import { drawShape } from './draw-shape.js';
function drawLoop(g, loop) {
    const centroid = getShapeCentroid(loop.beziers);
    // const area     = getShapeArea(loop.beziers);
    // const bounds   = getShapeBounds(loop);
    drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 500);
    return drawShape(g, loop.curves.map(curve => curve.ps), 'red thin10 fill30', undefined);
}
export { drawLoop };
//# sourceMappingURL=draw-loop.js.map