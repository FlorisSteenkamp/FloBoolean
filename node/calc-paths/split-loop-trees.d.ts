import { InOut } from "../containers/in-out/in-out.js";
/**
 * Take the forest of trees, create a new root making it a tree and snip
 * branches such that each branch determines a new set of loops each
 * representing an individual independent shape (possibly with holes or shapes
 * with absolute winding number > 1).
 *
 * @param root
 */
declare function splitLoopTrees(root: InOut): InOut[];
export { splitLoopTrees };
