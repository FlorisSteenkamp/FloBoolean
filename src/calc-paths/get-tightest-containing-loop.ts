import type { Out } from "../containers/in-out/in-out.js";
import { _isLoopInLoop } from '../is-loop-in-loop/is-loop-in-loop.js';
import { bezierPiecesFromOut$ } from "../main/bezier-pieces-from-out.js";


/**
 * Returns the tightest (deepest) loop in the containment tree rooted at `root`
 * that contains the given `loop`.
 *
 * Starting from `root`, the tree is traversed downwards, descending into a
 * node's children only while that node still contains `loop`. The last (deepest)
 * *containing* node found is returned.
 * 
 * * at this stage `loop` is the one with smallest `minY` (due to earlier sorting)
 * * `root` is assumed to contain `loop`
 *
 * @param root the root of the containment tree to search
 * @param loop the loop for which to find the tightest containing loop
 */
function getTightestContainingLoop(
        expMax: number,
        root: Out, 
        beziers: number[][][]): Out {
    
    let containingLoop = root;
    const stack = Array.from(root.children);

    while (stack.length) {
        const inOut = stack.pop()!;
        f(inOut);
    }

    return containingLoop!;

    function f(parent: Out) {
        const bezierPieces = bezierPiecesFromOut$(parent);
        if (_isLoopInLoop(expMax, beziers, bezierPieces)) {
            containingLoop = parent;

            for (const child of parent.children!) {
                stack.push(child);
            }
        }
    }
}


export { getTightestContainingLoop }
