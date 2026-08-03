import { getTs } from "./get-ts.js";
import { toP } from "../../../utils/to-p.js";
/**
 * Starting from the intersection `_x_` and following the loop in the given
 * direction, returns the curve and `t` value where the loop either:
 *
 *  * first reaches the edge of `targetBox` (e.g. the `nextOrPrev` container's
 *    box), or
 *  * reaches the end of a bezier whose endpoint lies outside `originalBox`
 *    (e.g. the current container's box) - i.e. the loop has left the original
 *    box without ever touching the target box.
 *
 * @param _x_ the intersection to start from (its `curve` and `x.ri.t` give the
 * starting bezier and parameter value)
 * @param dir `+1` to follow the loop forwards (via `curve.next`, increasing
 * `t`), `-1` to follow it backwards (via `curve.prev`, decreasing `t`)
 * @param targetBox the box to stop at when its edge is reached, given as
 * `[[minX, minY], [maxX, maxY]]`
 * @param originalBox the box the walk starts inside, given as
 * `[[minX, minY], [maxX, maxY]]`
 */
function followToBoxEdge(_x_, dir, targetBox, originalBox) {
    const forward = dir === 1;
    let { curve, x } = _x_;
    let t = x.ri.t;
    const startCurve = curve;
    let firstStep = true;
    while (true) {
        // (1) Does this bezier cross an edge of the target box ahead of `t`?
        const tHit = firstBoxCrossing(curve.ps, t, forward, targetBox);
        if (tHit !== undefined) {
            return { curve, t: tHit };
        }
        // (2) No crossing - has the loop left the original box by the end of
        //     this bezier?
        const tEnd = forward ? 1 : 0;
        const pEnd = toP(curve.ps, tEnd);
        if (!isInBox(pEnd, originalBox)) {
            return { curve, t: tEnd };
        }
        // (3) Still inside the original box - continue onto the adjacent bezier.
        curve = forward ? curve.next : curve.prev;
        t = forward ? 0 : 1;
        // Safety: never walk more than once around the closed loop.
        if (!firstStep && curve === startCurve) {
            return { curve, t: tEnd };
        }
        firstStep = false;
    }
}
/**
 * Returns the `t` value of the first place `ps` crosses an edge of `box` when
 * moving away from `tFrom` in the walk direction, or `undefined` if there is no
 * such crossing on this bezier.
 */
function firstBoxCrossing(ps, tFrom, forward, box) {
    let best = undefined;
    for (const edge of boxEdges(box)) {
        for (const { psX } of getTs(ps, edge)) {
            const t = psX.ri.t;
            if (forward
                ? (t > tFrom && (best === undefined || t < best))
                : (t < tFrom && (best === undefined || t > best))) {
                best = t;
            }
        }
    }
    return best;
}
/** The 4 edges of `[[minX, minY], [maxX, maxY]]` as order-1 bezier lines. */
function boxEdges(box) {
    const [[minX, minY], [maxX, maxY]] = box;
    return [
        [[minX, minY], [maxX, minY]], // top    (min y)
        [[minX, minY], [minX, maxY]], // left   (min x)
        [[minX, maxY], [maxX, maxY]], // bottom (max y)
        [[maxX, minY], [maxX, maxY]], // right  (max x)
    ];
}
/**
 * Whether point `p` lies within `box` (`[[minX, minY], [maxX, maxY]]`).
 */
function isInBox(p, box) {
    return p[0] >= box[0][0] && p[0] <= box[1][0]
        && p[1] >= box[0][1] && p[1] <= box[1][1];
}
export { followToBoxEdge };
//# sourceMappingURL=follow-to-box-edge.js.map