
import type { BezierPiece } from "flo-bezier3";


function bezierToBezierPiece(
        bezier: number[][]): BezierPiece {

    return {
        ps: bezier,
        ts: [0,1]
    }
}


export { bezierToBezierPiece }
