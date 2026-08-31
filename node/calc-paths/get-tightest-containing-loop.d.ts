import type { Out } from "../containers/in-out/in-out.js";
/**
 * Returns the tightest (deepest) loop in the containment tree rooted at `root`
 * that contains the given `loop`.
 *
 * Starting from `root`, the tree is traversed downwards, descending into a
 * node's children only while that node still contains `loop`. The last (deepest)
 * *containing* node found is returned.
 *
 * * at this stage `loop` is the one with smallest `minY` (due to earlier sorting)
 * * `root` is assumed to contain `loop`
 *
 * @param root the root of the containment tree to search
 * @param loop the loop for which to find the tightest containing loop
 */
declare function getTightestContainingLoop(expMax: number, root: Out, beziers: number[][][]): Out;
export { getTightestContainingLoop };
