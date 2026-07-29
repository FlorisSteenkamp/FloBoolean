import type { InOut, Out } from "../containers/in-out/in-out.js";
import type { Loop } from '../loop/loop.js';
import { isLoopInLoop } from './is-loop-in-loop.js';
import { bezierPieceToBezier } from './bezier-piece-to-bezier.js';


/**
 * @param root 
 * @param loop 
 */
function getTightestContainingLoop(
        root: Out, 
        loop: Loop): Out {
    
    let containingLoop: Out | undefined = undefined;
    const stack: Out[] = [root];
    while (stack.length) {
        const inOut = stack.pop()!;
        f(inOut);
    }

    return containingLoop!;

    function f(parent: Out) {
        // if (parent === root || isLoopInLoop(loop.beziers, parent.bezierPieces!)) {
        if (parent === root || isLoopInLoop(loop.beziers, parent.bezierPieces!.map(bezierPieceToBezier))) {
            containingLoop = parent;

            for (const child of parent.children!) {
                stack.push(child);
            }
        }
    }
}


export { getTightestContainingLoop }
