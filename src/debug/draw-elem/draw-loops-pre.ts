import { drawLoopPre } from "./draw-loop-pre.js";
import { drawShape } from "./draw-shape.js";


function drawLoopsPre(
        g: SVGGElement, 
        loops: number[][][][]): SVGElement[] {

    // const $svgs = [];

    // for (const loop of loops) {
    //     $svgs.push(...drawLoopPre(g, loop));
    // } 
    const $svgs = drawShape(g, loops, 'shape', undefined);

    return $svgs;
}


export { drawLoopsPre }