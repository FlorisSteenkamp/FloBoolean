import { drawLoop } from "./draw-loop";
function drawLoops(g, loops) {
    const $svgs = [];
    for (const loop of loops) {
        $svgs.push(...drawLoop(g, loop));
    }
    return $svgs;
}
export { drawLoops };
//# sourceMappingURL=draw-loops.js.map