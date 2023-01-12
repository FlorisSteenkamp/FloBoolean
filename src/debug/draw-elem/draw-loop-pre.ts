import { drawShape } from './draw-shape.js';


function drawLoopPre(
        g: SVGGElement, 
        loop: number[][][]): SVGElement[] {

    //const centroid = getLoopCentroid(loop);
    //const area     = getLoopArea(loop);
    //const bounds   = simplifyBounds(getLoopBounds(loop));
    //drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 0);

    return drawShape(g, loop, 'red thin10 fill30', undefined);
}


export { drawLoopPre }
