
import { isLoopInLoop } from './is-loop-in-loop';
import { InOut } from "../in-out";
import { Loop } from '../loop/loop';


/**
 * @param root 
 * @param loop 
 */
function getTightestContainingLoop(root: InOut, loop: Loop) {
    
    let containingLoop: InOut = undefined;
    let stack: InOut[] = [root];
    while (stack.length) {
        let inOut = stack.pop();
        f(inOut);
    }

    return containingLoop;

    function f(parent: InOut) {
        if (parent === root || isLoopInLoop(loop.beziers, parent.beziers)) {
            containingLoop = parent;

            for (let child of parent.children) {
                stack.push(child);
            }
        }
    }
}


export { getTightestContainingLoop }
