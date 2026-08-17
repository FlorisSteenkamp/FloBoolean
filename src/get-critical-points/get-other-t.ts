import type { X } from "./x.js";
import type { RootInterval } from "flo-poly";
import { intersectBoxes, bezierBezierIntersectionBoundless, getIntervalBox } from 'flo-bezier3';
import { toP } from "../utils/to-p.js";


// FUTURE - could this come from flo-bezier3
function getOtherTs(
        ps1: number[][], 
        ps2: number[][],
        ts2: RootInterval[]): [X,X][] | undefined {

    if (ts2 === undefined) {
        return undefined;  // infinite number of intersections
    }
    if (ts2.length === 0) { return []; }

    const ts1 = bezierBezierIntersectionBoundless(ps2, ps1);
    if (ts1 === undefined) {
        return undefined;  // infinite number of intersections
    } 
    if (ts1.length === 0) { return []; }

    const is1 = ts1.map(ri => getIntervalBox(ps1, [ri.tS, ri.tE]));
    const is2 = ts2.map(ri => getIntervalBox(ps2, [ri.tS, ri.tE]));

    const xPairs: [X,X][] = [];
    for (let i=0; i<ts1.length; i++) {
        const box1 = is1[i];
        for (let j=0; j<ts2.length; j++) {
            const box2 = is2[j];
            const box = intersectBoxes(box1,box2);
            if (box === undefined) { continue; }

            // FUTURE - combine boxes to make sense, i.e. combine better
            // e.g. two odd multiplicity boxes should combine to a single even, etc. etc.
            const p = toP(ps1, ts1[i].t);

            const x1: X = { ri: ts1[i], p, kind: 1 };
            const x2: X = { ri: ts2[j], p, kind: 1 };
            xPairs.push([x1, x2]);
        }
    }

    return xPairs;
}


export { getOtherTs }
