import type { BezierPiece } from "flo-bezier3";
import type { Out } from "../containers/in-out/in-out.js";
import { memoize } from "flo-memoize";
import { getBeziersToNextContainer } from "../calc-paths/get-beziers-to-next-container.js";


const bezierPiecesFromOut$ = memoize(function(
        out: Out) {

    const bezierPieces: BezierPiece[] = [];
    for (const out_ of out.path) {
        const beziersToNextContainer = getBeziersToNextContainer(out_ as Out);
        bezierPieces.push(...beziersToNextContainer);
    }

    return bezierPieces;
});


export { bezierPiecesFromOut$ }
