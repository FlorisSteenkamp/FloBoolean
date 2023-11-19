import { getBoundingHull } from "flo-bezier3";
import { isCubicReallyQuad } from "flo-bezier3";

const ps = [
    [590, 565],
    [589, 562],
    [586, 559],
    [585, 558]
];


isCubicReallyQuad(ps); //?
getBoundingHull(ps);  //?