import type { BezierPiece } from "flo-bezier3";
import type { Out } from "../containers/in-out/in-out.js";
import { memoize } from "flo-memoize";
import { getBeziersToNextContainer } from "../calc-paths/get-beziers-to-next-container.js";


const bezierPiecesFromOut$ = memoize(function(
        out: Out) {

    const bezierPieces: BezierPiece[] = [];
    for (const out_ of out.path) {
        // A `swapped` node is an original `In` whose `dir` was flipped so the
        // trace treats it as an `Out`. Walking it forward would wrap the long
        // way around the curve, so take its twin's (the original `Out`'s) short
        // forward arc and reverse it (piece order and each piece's t-range).
        if (out_.swapped) {
            const pieces = getBeziersToNextContainer(out_.twin as unknown as Out);
            for (let i = pieces.length - 1; i >= 0; i--) {
                const { ps, ts } = pieces[i];
                bezierPieces.push({ ps, ts: [ts[1], ts[0]] });
            }
        } else {
            bezierPieces.push(...getBeziersToNextContainer(out_ as Out));
        }
    }

    return bezierPieces;
});


export { bezierPiecesFromOut$ }
