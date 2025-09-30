import type { InOut } from "../containers/in-out/in-out.js";
import type { Loop } from '../loop/loop.js';
/**
 * @param root
 * @param loop
 */
declare function getTightestContainingLoop(root: InOut, loop: Loop): InOut;
export { getTightestContainingLoop };
