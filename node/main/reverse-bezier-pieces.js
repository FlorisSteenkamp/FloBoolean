function reverseBezierPieces(bezierPieces) {
    return bezierPieces.map(bp => ({
        ps: bp.ps,
        ts: [bp.ts[1], bp.ts[0]]
    })).toReversed();
}
export { reverseBezierPieces };
//# sourceMappingURL=reverse-bezier-pieces.js.map