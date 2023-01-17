import type { Loop } from "../../loop/loop.js";
import { drawLoop } from "./draw-loop.js";


function drawLoops(
        g: SVGGElement, 
        loops: Loop[]): SVGElement[] {

    const $svgs = [];

    for (const loop of loops) {
        $svgs.push(...drawLoop(g, loop));
    } 

    return $svgs;
}


export { drawLoops }