import type { BezierPiece } from "flo-bezier3";


/** 
 * Returns the result of combining the given loop of bezier pieces where
 * possible, e.g. two bezier pieces `{ ps: [[0,0],[1,1]], ts: [0,0.5] }` and
 * `{ ps: [[0,0],[1,1]], ts: [0.5,0.7] }` are combined to become 
 * `{ ps: [[0,0],[1,1]], ts: [0,0.7] }`. The last and first are also checked
 * against each other (since it forms a loop).
 */
function combineBezierPieces(
        loop: BezierPiece[]): BezierPiece[] {

    if (loop.length < 2) { return loop; }

    const result: BezierPiece[] = [];
    for (const piece of loop) {
        const last = result[result.length - 1];
        if (last !== undefined && canCombine(last, piece)) {
            result[result.length - 1] = combine(last, piece);
        } else {
            result.push(piece);
        }
    }

    // The pieces form a loop, so the last may continue into the first.
    while (result.length >= 2 &&
           canCombine(result[result.length - 1], result[0])) {

        result[0] = combine(result.pop()!, result[0]);
    }

    return result;
}


// Two pieces are one arc when they lie on the same underlying curve (same
// `ps` reference), their t-ranges meet (`a.ts[1] === b.ts[0]`) and both run
// in the same direction (so the merged range stays monotonic - a backtrack
// at the meeting point must stay split).
function canCombine(a: BezierPiece, b: BezierPiece) {
    return (
        a.ps === b.ps &&
        a.ts[1] === b.ts[0] &&
        (a.ts[1] - a.ts[0]) * (b.ts[1] - b.ts[0]) > 0
    );
}


function combine(a: BezierPiece, b: BezierPiece): BezierPiece {
    return { ps: a.ps, ts: [a.ts[0], b.ts[1]] };
}


export { combineBezierPieces }
