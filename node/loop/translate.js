"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateBeziers = void 0;
const flo_vector2d_1 = require("flo-vector2d");
function translateBeziers(v, bezierLoops1) {
    return bezierLoops1.map(loop => loop.map(ps => ps.map(flo_vector2d_1.translate(v))));
}
exports.translateBeziers = translateBeziers;
//# sourceMappingURL=translate.js.map