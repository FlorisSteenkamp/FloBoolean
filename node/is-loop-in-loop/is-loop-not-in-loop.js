import { getShapeBounds$ } from '../calc-paths/get-shape-bounds.js';
/**
 * Returns `true` if the first loop is not wholly within the second. The converse
 * is not necessarily true. It is assumed the loops don't intersect.
 *
 * @param loops
 */
function isLoopNotInLoop(loop1, loop2) {
    const bounds1 = getShapeBounds$(loop1);
    const bounds2 = getShapeBounds$(loop2);
    return (bounds1.minX < bounds2.minX ||
        bounds1.maxX > bounds2.maxX ||
        bounds1.minY < bounds2.minY ||
        bounds1.maxY > bounds2.maxY);
}
export { isLoopNotInLoop };
//# sourceMappingURL=is-loop-not-in-loop.js.map