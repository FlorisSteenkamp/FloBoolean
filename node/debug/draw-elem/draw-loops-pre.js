import { drawLoopPre } from "./draw-loop-pre";
function drawLoopsPre(g, loops) {
    const $svgs = [];
    for (const loop of loops) {
        $svgs.push(...drawLoopPre(g, loop));
    }
    return $svgs;
}
export { drawLoopsPre };
//# sourceMappingURL=draw-loops-pre.js.map