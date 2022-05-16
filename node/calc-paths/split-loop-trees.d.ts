import { InOut } from "../in-out.js";
/**
 * Take the forest of trees, create a new root making it a tree and snip
 * branches such that each branch determines a new set of loops each
 * representing an individual independent shape (possibly with holes).
 * @param root
 */
declare function splitLoopTrees(root: InOut): InOut[];
export { splitLoopTrees };
