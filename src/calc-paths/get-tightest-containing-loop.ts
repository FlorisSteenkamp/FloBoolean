import { isLoopInLoop } from './is-loop-in-loop.js';
import type { InOut } from "../containers/in-out/in-out.js";
import type { Loop } from '../loop/loop.js';
import { BezierPiece } from 'flo-bezier3';
import { bezierPieceToBezier } from './bezier-piece-to-bezier.js';


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
