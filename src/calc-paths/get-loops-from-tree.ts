import { InOut } from "../in-out.js";


/**
 * Returns an array of LoopTrees from the given LoopTree where each returned
 * LoopTree is one of the nodes of the tree. Nodes with winding number absolute
 * value > 1 are not returned.
 * @param root 
 */

function getLoopsFromTree(
        root: InOut): InOut[] {

    // console.log(root);
    const trees = [root];

    const stack = Array.from(root.children!);
    // const stack = Array.from(root.children!).filter(c => Math.abs(c.windingNum!) <= 1);
    while (stack.length) {
        const tree = stack.pop()!;

        if (tree.windingNum === 0) { 
            trees.push(tree);
        }

        for (const child of tree.children!) {
            // if (Math.abs(child.windingNum!) <= 1) {
                stack.push(child);
            // }
        }
    }
    // console.log(trees);

    return trees;
}


export { getLoopsFromTree }
