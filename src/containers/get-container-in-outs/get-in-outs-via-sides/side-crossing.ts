import type { RootInterval } from "flo-poly";
import type { X } from "../../../get-critical-points/x.js";


interface SideCrossing {
    readonly sideIdx: number;
    readonly riSide: RootInterval;
    readonly xPs: X;
    readonly ps: number[][];
}


export { SideCrossing }
