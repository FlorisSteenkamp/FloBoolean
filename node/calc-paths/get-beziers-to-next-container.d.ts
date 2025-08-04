import { InOut } from "../in-out";
declare function getBeziersToNextContainer(expMax: number, out: InOut): {
    beziers: number[][][];
    in_: InOut;
    inBez: number[][];
};
export { getBeziersToNextContainer };
