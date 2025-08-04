import { isLoopInLoop } from './is-loop-in-loop.js';
import { InOut } from "../in-out.js";
import { Loop } from '../loop/loop.js';


/**
 * @param root 
 * @param loop 
 */
function getTightestContainingLoop(
        root: InOut, 
        loop: Loop): InOut {
    
    let containingLoop: InOut | undefined = undefined;
    const stack: InOut[] = [root];
    while (stack.length) {
        const inOut = stack.pop()!;
        f(inOut);
    }

    return containingLoop!;

    function f(parent: InOut) {
        if (parent === root || isLoopInLoop(loop.beziers, parent.beziers!)) {
            containingLoop = parent;

            for (const child of parent.children!) {
                stack.push(child);
            }
        }
    }
}


export { getTightestContainingLoop }
