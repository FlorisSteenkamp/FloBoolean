import type { In, Out } from "../../containers/in-out/in-out.js";
/** builds a fresh `RebuiltInOut` copying the in/out's order-info caches */
declare function rebuildInOut(inOut: In | Out, dir: -1 | 1, swapped: boolean): In | Out;
export { rebuildInOut };
