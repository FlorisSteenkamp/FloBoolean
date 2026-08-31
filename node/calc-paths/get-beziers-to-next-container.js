function getBeziersToNextContainer(out) {
    const outX = out._x_;
    const inX = out.twin._x_;
    //----------------------------
    const curveS = outX.x.curve;
    const tS = outX.x.ri.t;
    const curveE = inX.x.curve;
    const tE = inX.x.ri.t;
    let curCurve = curveS;
    let curT = tS;
    const bezierPieces = [];
    while (true) {
        if (curCurve === curveE &&
            (curT < tE || (curT === tE && bezierPieces.length !== 0))) {
            const ps = curCurve.ps;
            const ts = [curT, tE];
            bezierPieces.push({ ps, ts });
            return bezierPieces;
        }
        else {
            const ps = curCurve.ps;
            const ts = [curT, 1];
            bezierPieces.push({ ps, ts });
        }
        curT = 0;
        curCurve = curCurve.next;
    }
}
export { getBeziersToNextContainer };
//# sourceMappingURL=get-beziers-to-next-container.js.map