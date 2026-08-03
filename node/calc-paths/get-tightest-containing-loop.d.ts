import type { Out } from "../containers/in-out/in-out.js";
import type { Loop } from '../shape/loop.js';
/**
 * @param root
 * @param loop
 */
declare function getTightestContainingLoop(root: Out, loop: Loop): Out;
export { getTightestContainingLoop };
