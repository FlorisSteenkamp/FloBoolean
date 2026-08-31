import type { BezierPiece } from 'flo-bezier3';
/**
 * Returns the curves of `loop` whose y-extent contains `y` (inclusive), i.e.
 * the candidates a horizontal ray at level `y` could possibly cross.
 *
 * The first call for a given `loop` builds a cached, coordinate-compressed slab
 * index in `O(n log n)`; each call then answers the stabbing query in
 * `O(log n)` via binary search (plus the returned candidate array, which the
 * caller must iterate anyway).
 *
 * @param loop a loop of curves
 * @param y the ray level
 */
declare function getCandidates(bezierPieces: BezierPiece[], y: number): BezierPiece[];
export { getCandidates };
