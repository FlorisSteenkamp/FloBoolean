import { bezierSelfIntersection, getIntervalBox } from 'flo-bezier3';
const eps = Number.EPSILON;
/**
 * @param loops
 */
function getSelfIntersections(loops) {
    const xs = [];
    for (const loop of loops) {
        for (const curve of loop.curves) {
            const ps = curve.ps;
            const ts = bezierSelfIntersection(ps);
            // if (ts === undefined) { continue; }  // there is no self-intersection
            if (ts.length === 0) {
                continue;
            }
            // if a cusp (or extremely close to it)
            const kind = ts[0] === ts[1]
                ? 3 /*cusp*/
                : 2 /*self-intersection*/;
            // FUTURE - fix box - must combine 2 boxes and bezierSelfIntersection must return intervals
            const t0S = ts[0] - eps;
            const t0E = ts[0] + eps;
            const t1S = ts[1] - eps;
            const t1E = ts[1] + eps;
            const box0 = getIntervalBox(ps, [t0S, t0E]); // ts are within 1 upls accurate
            const box1 = getIntervalBox(ps, [t1S, t1E]); // ts are within 1 upls accurate
            xs.push([
                // FUTURE - multiplicity relevant??
                { x: { ri: { t: t0S, tS: t0S, tE: t0E, multiplicity: 1 }, box: box0, kind }, curve },
                { x: { ri: { t: t1S, tS: t1S, tE: t1E, multiplicity: 1 }, box: box1, kind }, curve }
            ]);
        }
    }
    return xs;
}
export { getSelfIntersections };
//# sourceMappingURL=get-self-intersections.js.map