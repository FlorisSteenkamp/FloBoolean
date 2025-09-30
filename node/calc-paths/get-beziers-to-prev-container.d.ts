import { BezierPiece } from "flo-bezier3";
import { InOut } from "../containers/in-out/in-out.js";
declare function getBeziersToPrevContainer(in_: InOut, takenInOuts: Set<InOut>): {
    bezierPieces: BezierPiece[];
    inOut: InOut;
};
export { getBeziersToPrevContainer };
