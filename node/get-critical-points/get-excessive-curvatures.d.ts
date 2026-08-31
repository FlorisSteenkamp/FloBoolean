import type { X } from "./x.js";
import type { Loop } from "../shape/loop.js";
declare function getExcessiveCurvatures(expMax: number, loops: Loop[]): [X, X][];
export { getExcessiveCurvatures };
