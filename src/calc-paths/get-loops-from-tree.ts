import type { InOut } from "../containers/in-out/in-out.js";

const { abs, sign } = Math;


/**
 * Returns an array of LoopTrees from the given LoopTree where each returned
 * LoopTree is one of the nodes of the tree. Nodes with winding number absolute
 * value > 1 are not returned.
 * @param root 
 */

function getLoopsFromTree(
        booleanOp?: 'AND' | 'OR' | 'XOR') {

    return (root: InOut): InOut[] => {
        // At this point root will have a winding number of 1 or -1 (obviously since it's the outer loop)

        const trees =
              booleanOp === 'OR' || booleanOp === 'XOR'
            ? [root]  // include the outer loop in these cases (abs winding num 1)
            : [];

        // @ts-ignore
        root.used = booleanOp === 'OR' || booleanOp === 'XOR';

        const stack = Array.from(root.children!);
        while (stack.length) {
            const tree = stack.pop()!;

            if (booleanOp === 'OR') {
                if (tree.windingNum === 0) { 
                    trees.push(tree);
                }
            }

            if (booleanOp === 'AND') {
                const ancestorUsed = isAncestorUsed(tree);
                if ((tree.windingNum === 0 && ancestorUsed) ||
                    abs(tree.windingNum) >= 2 && !ancestorUsed) { 

                    trees.push(tree);
                    // @ts-ignore
                    tree.used = true;
                }
            }

            if (booleanOp === 'XOR') {
                const ancestorUsed = isAncestorUsed(tree);
                if ((tree.windingNum === 0 && ancestorUsed) ||
                    abs(tree.windingNum) >= 2 && ancestorUsed) { 

                    trees.push(tree);
                    // @ts-ignore
                    tree.used = true;
                }/* else if (abs(tree.windingNum) >= 2) {
                    // @ts-ignore
                    // tree.windingNum = 0;
                    // tree.orientation = -sign(tree.orientation);
                    trees.push(tree);
                    // @ts-ignore
                    tree.used = true;
                }*/
            }

            for (const child of tree.children!) {
                stack.push(child);
            }
        }

        return trees;
    }
}


function isAncestorUsed(
        inOut: InOut) {

    let parent = inOut.parent;
    while (true) {
        if (parent === undefined) {
            return false;
        }
        if (parent.used) {
            return true;
        }

        parent = parent.parent;
    }
}


export { getLoopsFromTree }
