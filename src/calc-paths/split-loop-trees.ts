import type { InOut } from "../containers/in-out/in-out.js";
import type { Mutable } from "../utils/mutable.js";


/**
 * Take the forest of trees, create a new root making it a tree and snip
 * branches such that each branch determines a new set of loops each 
 * representing an individual independent shape (possibly with holes or shapes
 * with absolute winding number > 1).
 * 
 * @param root 
 */
function splitLoopTrees(
        root: InOut) {

    const loopTrees: InOut[] = [];
    const stack: InOut[] = [root];

    while (stack.length) {
        const tree = stack.pop()!;

        if (tree.windingNum === 0) {
            loopTrees.push(...tree.children);
        }

        stack.push(...tree.children);

        if (tree.windingNum === 0) {
            // Make it a leaf - not strictly necessary as it will be ignored anyway
            (tree as Mutable<InOut>).children = new Set();
        }
    }

    return loopTrees;
}


export { splitLoopTrees }
