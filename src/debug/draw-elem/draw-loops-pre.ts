import { drawShape } from "./draw-shape.js";


function drawLoopsPre(
        g: SVGGElement, 
        loops: number[][][][]): SVGElement[] {

    const $svgs = drawShape(g, loops, 'shape', undefined);

    return $svgs;
}


export { drawLoopsPre }