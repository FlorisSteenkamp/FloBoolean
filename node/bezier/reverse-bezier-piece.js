function reverseBezierPiece(bezierPiece) {
    const { ps, ts } = bezierPiece;
    return {
        ps,
        ts: [ts[1], ts[0]]
    };
}
export { reverseBezierPiece };
//# sourceMappingURL=reverse-bezier-piece.js.map