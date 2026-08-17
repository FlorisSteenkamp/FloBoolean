import type { BezierPiece } from 'flo-bezier3';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { memoize } from 'flo-memoize';


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
function getCandidates(
        bezierPieces: BezierPiece[],
        y: number): BezierPiece[] {

    // For small loops the `O(n log n)` slab-index build isn't worth it - just
    // scan all curves and test the y-extent directly.
    if (bezierPieces.length < 10) {
        const candidates: BezierPiece[] = [];
        for (let i=0; i<bezierPieces.length; i++) {
            const bezierPiece = bezierPieces[i];
            const { ps } = bezierPiece;
            const [[,minY],[,maxY]] = getBoundingBox$(ps);
            if (minY <= y && maxY >= y) {
                candidates.push(bezierPiece);
            }
        }

        return candidates;
    }

    const index = buildSlabIndex$(bezierPieces);

    const { ys, slabs } = index;

    // `y` lies outside every curve's y-extent -> no candidates.
    if (ys.length === 0 || y < ys[0] || y > ys[ys.length - 1]) {
        return [];
    }

    // Binary search the compressed axis for the slab containing `y`.
    const k = lowerBound(ys, y);  // first boundary with ys[k] >= y
    const slab = ys[k] === y
        ? 2 * k        // exactly on a boundary -> point-slab
        : 2 * k - 1;   // strictly between ys[k-1] and ys[k] -> interval-slab

    return slabs[slab];
}


/**
 * A coordinate-compressed slab index over a loop's curves, used to answer
 * "which curves have a y-extent that contains `y`?" (a stabbing query) in
 * `O(log n)` instead of `O(n)`.
 */
type SlabIndex = {
    /** sorted, distinct slab-boundary y-coordinates (the compressed axis) */
    ys: number[];
    /**
     * Candidate curves per slab. There are `2*ys.length - 1` slabs alternating
     * between point-slabs (even indices, exactly on a boundary) and
     * open-interval-slabs (odd indices, strictly between two boundaries):
     *
     *   slab 2k     = { ys[k] }              (a single boundary coordinate)
     *   slab 2k+1   = ( ys[k], ys[k+1] )     (strictly between two boundaries)
     *
     * The alternation preserves the original inclusive containment test
     * (`minY <= y && maxY >= y`) even when `y` lands exactly on a boundary.
     */
    slabs: BezierPiece[][];
}


/**
 * Returns the index of the first element in `arr` that is `>= x`
 * (i.e. a standard lower-bound binary search). `arr` must be sorted ascending.
 */
function lowerBound(
        arr: number[],
        x: number): number {

    let lo = 0;
    let hi = arr.length;

    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (arr[mid] < x) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }

    return lo;
}


/**
 * Builds the coordinate-compressed slab index for a loop.
 *
 * @param loop a loop of curves
 */
const buildSlabIndex$ = memoize(function(
        bezierPieces: BezierPiece[]): SlabIndex {

    //------------------------------------------------------/
    //---- Coordinate compression: gather + dedupe extents -/
    //------------------------------------------------------/
    const coords = new Set<number>();
    const extents: [number, number][] = new Array(bezierPieces.length);
    for (let i=0; i<bezierPieces.length; i++) {
        const { ps } = bezierPieces[i];
        const [[,minY],[,maxY]] = getBoundingBox$(ps);
        extents[i] = [minY, maxY];
        coords.add(minY);
        coords.add(maxY);
    }

    const ys = Array.from(coords).sort((a,b) => a - b);

    const slabCount = ys.length === 0 ? 0 : 2*ys.length - 1;
    const slabs: BezierPiece[][] = new Array(slabCount);
    for (let s=0; s<slabCount; s++) { slabs[s] = []; }

    //------------------------------------------------------/
    //---- Bucket each curve into the slabs it covers ------/
    //------------------------------------------------------/
    // A curve with extent [minY, maxY] covers every slab from the point-slab of
    // `minY` (index `2*a`) through the point-slab of `maxY` (index `2*b`),
    // inclusive - which also includes all interval-slabs in between.
    for (let i=0; i<bezierPieces.length; i++) {
        const [minY, maxY] = extents[i];
        const loSlab = 2 * lowerBound(ys, minY);  // both endpoints are present
        const hiSlab = 2 * lowerBound(ys, maxY);  // in `ys`, so this is exact
        for (let s=loSlab; s<=hiSlab; s++) {
            const bezierPiece = bezierPieces[i];
            slabs[s].push(bezierPiece);
        }
    }

    return { ys, slabs };
});


export { getCandidates }
