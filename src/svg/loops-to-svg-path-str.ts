import { beziersToSvgPathStr } from "./beziers-to-svg-path-str.js";


/**
 * Returns an SVG path string representation of the given bezier loops.
 * 
 * @param loops an array of loops having an array of bezier curves each given as 
 * an array of control points
 */
function loopsToSvgPathStr(
        loops: number[][][][]) {

    const strs: string[] = [];
    for (const loop of loops) {
        strs.push(beziersToSvgPathStr(loop));
    }

    return strs.join('\n');
}


export { loopsToSvgPathStr }
