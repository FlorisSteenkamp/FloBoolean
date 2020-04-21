"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beziers_to_svg_path_str_1 = require("./beziers-to-svg-path-str");
/**
 * Returns an SVG path string representation of the given bezier loops.
 * @param loops An array of loops having an array of bezier curves each given as
 * an array of control points.
 */
function loopsToSvgPathStr(loops) {
    let str = '';
    for (let loop of loops) {
        str = str + beziers_to_svg_path_str_1.beziersToSvgPathStr(loop) + '\n';
    }
    return str;
}
exports.loopsToSvgPathStr = loopsToSvgPathStr;
//# sourceMappingURL=loops-to-svg-path-str.js.map