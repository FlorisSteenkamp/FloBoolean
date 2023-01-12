/**
 * Returns an array of LoopTrees from the given LoopTree where each returned
 * LoopTree is one of the nodes of the tree. Nodes with winding number absolute
 * value > 1 are not returned.
 * @param root
 */
function getLoopsFromTree(root) {
    const trees = [root];
    const stack = Array.from(root.children);
    while (stack.length) {
        const tree = stack.pop();
        if (tree.windingNum === 0) {
            trees.push(tree);
        }
        for (const child of tree.children) {
            stack.push(child);
        }
    }
    return trees;
}
export { getLoopsFromTree };
//# sourceMappingURL=get-loops-from-tree.js.map