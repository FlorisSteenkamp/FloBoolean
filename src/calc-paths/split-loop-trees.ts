import type { Out } from "../containers/in-out/in-out.js";


/**
 * Take the forest of trees and return, for each independent shape, its root
 * loop (possibly with holes or shapes with absolute winding number > 1).
 *
 * A shape root is any non-zero-winding node whose parent face has winding 0;
 * a winding-0 node is never itself a shape root - its own non-zero children
 * (islands within holes, ...) are collected instead. Does **not** mutate the
 * tree, so the same `root` can be decomposed again (e.g. under a different
 * boolean op).
 *
 * @param root 
 */
function splitLoopTrees(
        root: Out) {

    const loopTrees: Out[] = [];
    const stack: Out[] = [root];

    while (stack.length) {
        const tree = stack.pop()!;

        if (tree.windingNum === 0) {
            for (const child of tree.children) {
                // winding-0 children aren't shape roots; their own non-zero
                // descendants are collected when those children are visited
                if (child.windingNum !== 0) { loopTrees.push(child); }
            }
        }

        stack.push(...tree.children);
    }

    return loopTrees;
}


export { splitLoopTrees }
