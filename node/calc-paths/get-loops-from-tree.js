const { abs } = Math;
/**
 * Returns `true` if a region with the given winding number belongs to the
 * result of the given boolean operation, i.e. the operation's membership
 * predicate `P(windingNum)`.
 *
 * - `OR`  (union)         : winding number !== 0
 * - `AND` (intersection)  : |winding number| >= 2 (covered two or more times)
 * - `XOR` (symmetric diff): winding number is odd
 */
function inResult(booleanOp, windingNum) {
    if (booleanOp === 'AND') {
        return abs(windingNum) >= 2;
    }
    if (booleanOp === 'XOR') {
        return (abs(windingNum) % 2) === 1;
    }
    // 'OR' and the default
    return windingNum !== 0;
}
/**
 * Returns the selected loop nodes that bound the result of the given boolean
 * operation for the given tree, each paired with its nesting `depth` (the
 * number of selected ancestor loops within this tree).
 *
 * A loop is included exactly when membership in the result changes across it,
 * i.e. when `P(node.windingNum) !== P(parent.windingNum)` where `P` is the
 * operation's membership predicate (see `inResult`) and the region outside the
 * outermost loop (winding number 0) is never in the result.
 *
 * The returned loops are precisely the boundary of the result region. The
 * `depth` lets the caller alternate loop orientations by nesting level so that
 * the non-zero winding fill rule reproduces the region for arbitrarily nested
 * loops (outer loops, holes, islands within holes, ...).
 *
 * @param root the outer loop of an independent shape (winding number 1 or -1)
 */
function getLoopsFromTree(booleanOp) {
    return (root) => {
        const selected = [];
        // Each stack entry is a node paired with the number of selected
        // ancestor loops above it within this tree.
        const stack = [[root, 0]];
        while (stack.length) {
            const [tree, ancestorCount] = stack.pop();
            // Winding number of the face just outside this loop (0 if this is
            // the outermost loop of the shape).
            const parentWinding = tree.parent.windingNum;
            // Include this loop iff result membership flips across it.
            const isSelected = inResult(booleanOp, tree.windingNum) !==
                inResult(booleanOp, parentWinding);
            if (isSelected) {
                selected.push({
                    out: tree,
                    depth: ancestorCount,
                    windingNum: tree.windingNum,
                    parentWinding,
                });
            }
            const childAncestorCount = isSelected ? ancestorCount + 1 : ancestorCount;
            for (const child of tree.children) {
                stack.push([child, childAncestorCount]);
            }
        }
        return selected;
    };
}
export { getLoopsFromTree };
//# sourceMappingURL=get-loops-from-tree.js.map