/**
 * Take the forest of trees, create a new root making it a tree and snip
 * branches such that each branch determines a new set of loops each
 * representing an individual independent shape (possibly with holes or shapes
 * with absolute winding number > 1).
 *
 * @param root
 */
function splitLoopTrees(root) {
    const loopTrees = [];
    const stack = [root];
    while (stack.length) {
        const tree = stack.pop();
        if (tree.windingNum === 0) {
            loopTrees.push(...tree.children);
        }
        stack.push(...tree.children);
        if (tree.windingNum === 0) {
            // Make it a leaf - not strictly necessary as it will be ignored anyway
            tree.children = new Set();
        }
    }
    return loopTrees;
}
export { splitLoopTrees };
//# sourceMappingURL=split-loop-trees.js.map