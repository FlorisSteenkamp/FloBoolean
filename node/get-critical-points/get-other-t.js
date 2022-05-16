import { intersectBoxes, bezierBezierIntersectionBoundless, getIntervalBox } from 'flo-bezier3';
// TODO - could this come from flo-bezier3
function getOtherTs(ps1, ps2, ts2) {
    if (ts2 === undefined) {
        // infinite number of intersections
        return undefined;
    }
    if (ts2.length === 0) {
        return [];
    }
    let ts1 = bezierBezierIntersectionBoundless(ps2, ps1);
    if (ts1 === undefined) {
        // infinite number of intersections
        return undefined;
    }
    if (ts1.length === 0) {
        return [];
    }
    let is1 = ts1.map(ri => getIntervalBox(ps1, [ri.tS, ri.tE]));
    let is2 = ts2.map(ri => getIntervalBox(ps2, [ri.tS, ri.tE]));
    let xPairs = [];
    for (let i = 0; i < ts1.length; i++) {
        let box1 = is1[i];
        for (let j = 0; j < ts2.length; j++) {
            let box2 = is2[j];
            let box = intersectBoxes(box1, box2);
            if (box !== undefined) {
                // TODO important - combine boxes to make sense, i.e. combine better
                // e.g. two odd multiplicity boxes should combine to a single even, etc. etc.
                let x1 = { ri: ts1[i], box, kind: 1 };
                let x2 = { ri: ts2[j], box, kind: 1 };
                xPairs.push([x1, x2]);
            }
        }
    }
    return xPairs;
}
export { getOtherTs };
//# sourceMappingURL=get-other-t.js.map