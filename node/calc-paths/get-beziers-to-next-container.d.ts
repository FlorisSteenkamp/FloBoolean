import type { BezierPiece } from "flo-bezier3";
import type { In, Out } from "../containers/in-out/in-out.js";
declare function getBeziersToNextContainer(out: Out, nextIn: In): BezierPiece[];
export { getBeziersToNextContainer };
