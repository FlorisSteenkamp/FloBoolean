"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beziersToSvgPathStr = exports.getPathsFromStr = exports.getLoopArea = exports.enableDebugForBooleanOp = exports.simplifyPaths = void 0;
const simplify_paths_1 = require("./calc-paths/simplify-paths");
Object.defineProperty(exports, "simplifyPaths", { enumerable: true, get: function () { return simplify_paths_1.simplifyPaths; } });
const get_loop_area_1 = require("./loop/get-loop-area");
Object.defineProperty(exports, "getLoopArea", { enumerable: true, get: function () { return get_loop_area_1.getLoopArea; } });
const debug_1 = require("./debug/debug");
Object.defineProperty(exports, "enableDebugForBooleanOp", { enumerable: true, get: function () { return debug_1.enableDebugForBooleanOp; } });
const get_paths_from_str_1 = require("./svg/get-paths-from-str");
Object.defineProperty(exports, "getPathsFromStr", { enumerable: true, get: function () { return get_paths_from_str_1.getPathsFromStr; } });
const beziers_to_svg_path_str_1 = require("./svg/beziers-to-svg-path-str");
Object.defineProperty(exports, "beziersToSvgPathStr", { enumerable: true, get: function () { return beziers_to_svg_path_str_1.beziersToSvgPathStr; } });
//# sourceMappingURL=index.js.map