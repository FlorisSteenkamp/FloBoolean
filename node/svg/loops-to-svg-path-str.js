import { beziersToSvgPathStr } from "./beziers-to-svg-path-str.js";
/**
 * Returns an SVG path string representation of the given bezier loops.
 * @param loops An array of loops having an array of bezier curves each given as
 * an array of control points.
 */
function loopsToSvgPathStr(loops) {
    let str = '';
    for (let loop of loops) {
        str = str + beziersToSvgPathStr(loop) + '\n';
    }
    return str;
}
export { loopsToSvgPathStr };
//# sourceMappingURL=loops-to-svg-path-str.js.map