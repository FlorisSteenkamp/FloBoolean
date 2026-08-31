import type { X } from "./x.js";
import type { RootInterval } from "flo-poly";
import { Curve } from "../curve/curve.js";
declare function getOtherTs(curveA: Curve, curveB: Curve, ts2: RootInterval[]): [X, X][] | undefined;
export { getOtherTs };
