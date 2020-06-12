"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableDebugForBooleanOp = void 0;
const draw_elem_1 = require("./draw-elem/draw-elem");
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debug a (possibly undefined) debug object
 */
function enableDebugForBooleanOp(debugOn) {
    var _a, _b, _c;
    if (!debugOn) {
        window._debug_ = undefined;
        return;
    }
    let debug = window._debug_;
    debug = Object.assign(Object.assign({}, debug), { generated: Object.assign(Object.assign({}, debug === null || debug === void 0 ? void 0 : debug.generated), { elems: Object.assign(Object.assign({}, (_a = debug === null || debug === void 0 ? void 0 : debug.generated) === null || _a === void 0 ? void 0 : _a.elems), { minY: [], loop: [], loops: [], intersection: [], container: [], bezier_: [], looseBoundingBox_: [], tightBoundingBox_: [], boundingHull_: [] }), timing: Object.assign(Object.assign({}, (_b = debug === null || debug === void 0 ? void 0 : debug.generated) === null || _b === void 0 ? void 0 : _b.timing), { normalize: 0, simplifyPaths: 0 }) }), fs: Object.assign(Object.assign({}, debug === null || debug === void 0 ? void 0 : debug.fs), { drawElem: Object.assign(Object.assign({}, (_c = debug === null || debug === void 0 ? void 0 : debug.fs) === null || _c === void 0 ? void 0 : _c.drawElem), draw_elem_1.drawElemFunctions) }) });
    window._debug_ = debug;
}
exports.enableDebugForBooleanOp = enableDebugForBooleanOp;
//# sourceMappingURL=debug.js.map