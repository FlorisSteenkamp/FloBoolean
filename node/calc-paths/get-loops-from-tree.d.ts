import { InOut } from "../in-out";
/**
 * Returns an array of LoopTrees from the given LoopTree where each returned
 * LoopTree is one of the nodes of the tree. Nodes with winding number absolute
 * value > 1 are not returned.
 * @param root
 */
declare function getLoopsFromTree(root: InOut): InOut[];
export { getLoopsFromTree };
