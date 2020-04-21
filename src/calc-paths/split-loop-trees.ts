
import { InOut } from "../in-out";


/**
 * Take the forest of trees, create a new root making it a tree and snip
 * branches such that each branch determines a new set of loops each 
 * representing an individual independent shape (possibly with holes).
 * @param root 
 */
function splitLoopTrees(root: InOut) {

    let iLoopTrees: InOut[] = [];
    let stack: InOut[] = [root];

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


export { splitLoopTrees }
