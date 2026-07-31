import type { Loop } from "../../shape/loop.js";
import { drawFs } from 'flo-draw';
// import { getLoopArea, getShapeArea } from '../../loop/get-loop-area.js';
import { getShapeCentroid } from '../../shape/get-shape-centroid.js'
// import { getShapeBounds } from '../../loop/get-loop-bounds.js';
import { drawShape } from './draw-shape.js';
import { getWindingNumber } from "../../shape/get-winding-number.js";


function drawLoop(
        g: SVGGElement, 
        loop: Loop): SVGElement[] {

    const centroid = getShapeCentroid(loop.beziers);
    // const area     = getShapeArea(loop.beziers);
    // const bounds   = getShapeBounds(loop);
    // drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 500);
    drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 5000);

    const { beziers } = loop;
    const windingNum = getWindingNumber(beziers);

    return drawShape(
        g, 
        // loop.curves.map(curve => curve.ps), 
        [beziers],
        // 'red thin10 fill30', 
          windingNum > 0 ? 'red thin0 fill10' :
          windingNum < 0 ? 'blue thin0 fill10' :
          'black thin0 fill10',

        undefined
    );
}


export { drawLoop }
