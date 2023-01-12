import { beziersToSvgPathStr } from "./beziers-to-svg-path-str.js";


/**
 * Returns an SVG path string representation of the given bezier loops.
 * @param loops An array of loops having an array of bezier curves each given as 
 * an array of control points.
 */
function loopsToSvgPathStr(
        loops: number[][][][]) {

    let str = '';
    for (const loop of loops) {
        str = str + beziersToSvgPathStr(loop) + '\n';
    }

    return str;
}


export { loopsToSvgPathStr }
