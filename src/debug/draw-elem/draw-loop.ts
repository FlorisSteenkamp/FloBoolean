import type { Loop } from "../../loop/loop";
import { drawFs } from 'flo-draw';
import { getLoopArea } from '../../loop/get-loop-area';
import { getLoopCentroid } from '../../loop/get-loop-centroid'
import { getLoopBounds } from '../../loop/get-loop-bounds';
import { simplifyBounds } from '../../loop/simplify-bounds';
import { drawShape } from './draw-shape';


function drawLoop(
        g: SVGGElement, 
        loop: Loop): SVGElement[] {

    const centroid = getLoopCentroid(loop);
    const area     = getLoopArea(loop);
    const bounds   = simplifyBounds(getLoopBounds(loop));
    drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 500);

    return drawShape(
        g, 
        loop.curves.map(curve => curve.ps), 
        'red thin10 fill30', 
        undefined
    );
}


export { drawLoop }
