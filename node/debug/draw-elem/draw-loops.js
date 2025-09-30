// import { drawLoop } from "./draw-loop.js";
import { drawShape } from "./draw-shape.js";
function drawLoops(g, loops) {
    // const $svgs = [];
    // for (const loop of loops) {
    // $svgs.push(...drawLoop(g, loop));
    // $svgs.push(...drawShape(g, loop.beziers, 'shape', undefined));
    // $svgs.push(drawShape(g, loops.map(loop => loop.beziers), 'shape', undefined)[0]);
    // } 
    const $svgs = drawShape(g, loops.map(loop => loop.beziers), 'shape', undefined);
    return $svgs;
}
export { drawLoops };
//# sourceMappingURL=draw-loops.js.map