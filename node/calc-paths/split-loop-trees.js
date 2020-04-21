"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Take the forest of trees, create a new root making it a tree and snip
 * branches such that each branch determines a new set of loops each
 * representing an individual independent shape (possibly with holes).
 * @param root
 */
function splitLoopTrees(root) {
    let iLoopTrees = [];
    let stack = [root];
    while (stack.length) {
        let tree = stack.pop();
        tree.children = tree.children || new Set();
        for (let child of tree.children) {
            if (tree.windingNum === 0) {
                iLoopTrees.push(child);
            }
            stack.push(child);
        }
        if (tree.windingNum === 0) {
            tree.children = new Set(); // Make it a leaf
        }
    }
    return iLoopTrees;
}
exports.splitLoopTrees = splitLoopTrees;
//# sourceMappingURL=split-loop-trees.js.map