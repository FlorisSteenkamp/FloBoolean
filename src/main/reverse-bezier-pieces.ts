import { BezierPiece } from "flo-bezier3";


function reverseBezierPieces(
        bezierPieces: BezierPiece[]): BezierPiece[] {

    return bezierPieces.map(bp => ({
        ps: bp.ps,
        ts: [bp.ts[1], bp.ts[0]]
    })).toReversed();
}


export { reverseBezierPieces }
