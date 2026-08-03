import type { Out } from "../containers/in-out/in-out.js";
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
declare function getLoopsFromTree(booleanOp?: 'AND' | 'OR' | 'XOR'): (root: Out) => {
    out: Out;
    depth: number;
}[];
export { getLoopsFromTree };
