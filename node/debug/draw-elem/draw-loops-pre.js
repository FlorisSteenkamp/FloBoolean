import { drawShape } from "./draw-shape.js";
function drawLoopsPre(g, loops) {
    // const $svgs = [];
    // for (const loop of loops) {
    //     $svgs.push(...drawLoopPre(g, loop));
    // } 
    const $svgs = drawShape(g, loops, 'shape', undefined);
    return $svgs;
}
export { drawLoopsPre };
//# sourceMappingURL=draw-loops-pre.js.map