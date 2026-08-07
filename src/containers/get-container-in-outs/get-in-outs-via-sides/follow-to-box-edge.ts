// import type { _X_ } from "../../../get-critical-points/-x-.js";
// import type { Curve } from "../../../curve/curve.js";
// import type { Container } from "../../container.js";
// import type { InOut } from "../../in-out/in-out.js";
// import { getTs } from "./get-ts.js";
// import { toP } from "../../../utils/to-p.js";


// /**
//  * Starting from the intersection `_x_` and following the loop in the given
//  * direction, returns the curve and `t` value where the loop either:
//  *
//  *  * first reaches the edge of `targetBox` (e.g. the `nextOrPrev` container's
//  *    box), or
//  *  * reaches the end of a bezier whose endpoint lies outside `originalBox`
//  *    (e.g. the current container's box) - i.e. the loop has left the original
//  *    box without ever touching the target box.
//  *
//  * @param _x_ the intersection to start from (its `curve` and `x.ri.t` give the
//  * starting bezier and parameter value)
//  * @param dir `+1` to follow the loop forwards (via `curve.next`, increasing
//  * `t`), `-1` to follow it backwards (via `curve.prev`, decreasing `t`)
//  * @param targetContainer the box to stop at when its edge is reached, given as
//  * `[[minX, minY], [maxX, maxY]]`
//  * @param originalContainer the box the walk starts inside, given as
//  * `[[minX, minY], [maxX, maxY]]`
//  */
// function followToBoxEdge(
//         inOut: InOut): { curve: Curve; t: number, p: number[] } {

//     const { container, side, sideX, dir, idx, _x_, nextOrPrev } = inOut;
//     let { curve, x } = _x_;
//     let t = x.ri.t;
//     const { box } = container;

//     const nextOrPrevContainer = nextOrPrev.container;

//     const forward = dir === 1;

//     // const startCurve = curve;
//     // let firstStep = true;

//     const boxL = box[0][0];
//     const boxR_ = nextOrPrevContainer.box[1][0];

//     const W = boxR_ - boxL;
//     const xx = boxR_ + W;


//     //------------------------
//     // First step outside box
//     //------------------------

//     while (true) {
//         // (1) Does this bezier cross an edge of the target box ahead of `t`?
//         const hit = firstBoxCrossing(curve.ps, t, forward, nextOrPrevContainer);
//         if (hit !== undefined) {
//             const { xx, best: tHit } = hit;
//             const { ps } = curve;
//             const p = toP(curve.ps, tHit);

//             // getImplicitFor

//             return { curve, t: tHit, p };
//         }

//         // (2) No crossing - has the loop left the original box by the end of
//         //     this bezier?
//         const tEnd = forward ? 1 : 0;
//         const pEnd = toP(curve.ps, tEnd);
//         if (!isInBox(pEnd, container.box)) {
//             return { curve, t: tEnd, p: pEnd };
//         }

//         // (3) Still inside the original box - continue onto the adjacent bezier.
//         curve = forward ? curve.next : curve.prev;
//         t = forward ? 0 : 1;

//         // Safety: never walk more than once around the closed loop.
//         // TODO
//         // if (!firstStep && curve === startCurve) {
//         //     const p = toP(curve.ps, tEnd);
//         //     return { curve, t: tEnd, p };
//         // }
//         // firstStep = false;
//     }
// }


// /**
//  * Returns the `t` value of the first place `ps` crosses an edge of `box` when
//  * moving away from `tFrom` in the walk direction, or `undefined` if there is no
//  * such crossing on this bezier.
//  */
// function firstBoxCrossing(
//         ps: number[][],
//         tFrom: number,
//         forward: boolean,
//         container: Container) {

//     // Cross-check: find any intersection enclosed by this box that lies on the
//     // current bezier and is ahead of `tFrom` in the walk direction, taking the
//     // nearest such one.
//     let tt: number | undefined = undefined;
//     for (const x_ of container.xs) {
//         if (x_.curve.ps !== ps) { continue; }

//         const t = x_.x.ri.t;
//         if (forward
//             ? (t > tFrom && (tt === undefined || t < tt))
//             : (t < tFrom && (tt === undefined || t > tt))) {

//             tt = t;
//         }
//     }

//     const xx = container.box[1][0];  // box right side

//     let best: number | undefined = undefined;

//     for (const edge of boxEdges(container.box)) {
//         for (const { psX } of getTs(ps, edge)) {
//             const t = psX.ri.t;

//             if (forward
//                 ? (t > tFrom && (best === undefined || t < best))
//                 : (t < tFrom && (best === undefined || t > best))) {

//                 best = t;
//             }
//         }
//     }
//     // console.log(best, tt, container);
//     // console.log(best, tt);

//     // return tt;
//     if (best === undefined) {
//         return undefined;
//     }

//     return { xx, best };
// }


// /** The 4 edges of `[[minX, minY], [maxX, maxY]]` as order-1 bezier lines. */
// function boxEdges(
//         box: number[][]): number[][][] {

//     const [[minX, minY], [maxX, maxY]] = box;

//     return [
//         [[minX, minY], [maxX, minY]],  // top    (min y)
//         [[minX, minY], [minX, maxY]],  // left   (min x)
//         [[minX, maxY], [maxX, maxY]],  // bottom (max y)
//         [[maxX, minY], [maxX, maxY]],  // right  (max x)
//     ];
// }


// /**
//  * Whether point `p` lies within `box` (`[[minX, minY], [maxX, maxY]]`).
//  */
// function isInBox(p: number[], box: number[][]): boolean {
//     return p[0] >= box[0][0] && p[0] <= box[1][0]
//         && p[1] >= box[0][1] && p[1] <= box[1][1];
// }


// export { followToBoxEdge }
