import type { BezierPiece } from "flo-bezier3";


function reverseBezierPiece(
        bezierPiece: BezierPiece): BezierPiece {

    const { ps, ts } = bezierPiece;

    return {
        ps,
        ts: [ts[1], ts[0]]
    }
}


export { reverseBezierPiece }
