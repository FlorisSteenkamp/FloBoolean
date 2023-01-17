import type { Loop } from "../../loop/loop.js";
import { drawFs } from 'flo-draw';
import { getLoopArea } from '../../loop/get-loop-area.js';
import { getLoopCentroid } from '../../loop/get-loop-centroid.js'
import { getLoopBounds } from '../../loop/get-loop-bounds.js';
import { simplifyBounds } from '../../loop/simplify-bounds.js';
import { drawShape } from './draw-shape.js';


function drawLoop(
        g: SVGGElement, 
        loop: Loop): SVGElement[] {

    const centroid = getLoopCentroid(loop);
    const area     = getLoopArea(loop);
    const bounds   = simplifyBounds(getLoopBounds(loop));
    drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 0);

    return drawShape(
        g, 
        loop.curves.map(curve => curve.ps), 
        'red thin10 fill30', 
        undefined
    );
}


export { drawLoop }
