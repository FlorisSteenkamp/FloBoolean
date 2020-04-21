"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simplify_paths_1 = require("./calc-paths/simplify-paths");
exports.simplifyPaths = simplify_paths_1.simplifyPaths;
const get_loop_area_1 = require("./loop/get-loop-area");
exports.getLoopArea = get_loop_area_1.getLoopArea;
const debug_1 = require("./debug/debug");
exports.enableDebugForBooleanOp = debug_1.enableDebugForBooleanOp;
const get_paths_from_str_1 = require("./svg/get-paths-from-str");
exports.getPathsFromStr = get_paths_from_str_1.getPathsFromStr;
const beziers_to_svg_path_str_1 = require("./svg/beziers-to-svg-path-str");
exports.beziersToSvgPathStr = beziers_to_svg_path_str_1.beziersToSvgPathStr;
//# sourceMappingURL=index.js.map