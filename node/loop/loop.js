function isPoint(ps) {
    if (ps.length === 2) {
        return (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1] // p[0] === p[1]
        );
    }
    if (ps.length === 3) {
        return (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1] && // p[0] === p[1]
            ps[1][1] === ps[2][1] && ps[1][1] === ps[2][1] // p[1] === p[2]
        );
    }
    return (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1] && // p[0] === p[1]
        ps[1][1] === ps[2][1] && ps[1][1] === ps[2][1] && // p[1] === p[2]
        ps[2][1] === ps[3][1] && ps[2][1] === ps[3][1] // p[2] === p[3]
    );
}
/**
 * @param beziers a pre-ordered array of bezier curves to add initially.
 * @param idx an optional index to assign to the loop - it can be anything
 */
function loopFromBeziers(beziers = [], idx) {
    let curves = [];
    let loop = { beziers, curves, idx };
    if (!beziers.length) {
        return loop;
    }
    let prev = undefined;
    let j = 0;
    for (let i = 0; i < beziers.length; i++) {
        if (isPoint(beziers[i])) {
            continue;
        }
        let curve = {
            loop,
            ps: beziers[i],
            prev: prev,
            next: undefined,
            idx: j
        };
        if (prev) {
            prev.next = curve;
        }
        prev = curve;
        curves.push(curve);
        j++;
    }
    // close loop
    let lastCurve = curves[curves.length - 1];
    curves[0].prev = lastCurve;
    lastCurve.next = curves[0];
    // TODO - remove this eventually
    lastCurve.ps[lastCurve.ps.length - 1] = curves[0].ps[0];
    return loop;
}
export { loopFromBeziers };
//# sourceMappingURL=loop.js.map