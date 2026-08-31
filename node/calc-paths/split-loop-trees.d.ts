import type { Out } from "../containers/in-out/in-out.js";
/**
 * Take the forest of trees (the `children` of `root`) and return, for each
 * independent shape, its root loop (possibly with holes or shapes with
 * absolute winding number > 1).
 *
 * A shape root is any non-zero-winding node whose parent face has winding 0;
 * a winding-0 node is never itself a shape root - its own non-zero children
 * (islands within holes, ...) are collected instead. Does **not** mutate the
 * tree, so the same `root` can be decomposed again (e.g. under a different
 * boolean op).
 *
 * @param root
 */
declare function splitLoopTrees(root: Out): Out[];
export { splitLoopTrees };
