import { fromTo } from "flo-bezier3";
function bezierPieceToBezier(bezierPiece) {
    const { ps, ts } = bezierPiece;
    return fromTo(ps, ts[0], ts[1]);
}
export { bezierPieceToBezier };
//# sourceMappingURL=bezier-piece-to-bezier.js.map