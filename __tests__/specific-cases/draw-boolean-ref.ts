import type { CanvasRenderingContext2D } from 'canvas';
import { flattenLoop } from './flatten-loop.js';

const { abs } = Math;


/** Number of line segments used to flatten each bezier for winding rasterization. */
const FLATTEN_SEGMENTS = 128;


/**
 * Renders the boolean operation of the given operand loops. The library
 * defines the operations by winding number (see `getLoopsFromTree`):
 *   `OR`  -> covered >= 1 times (winding != 0, union)
 *   `AND` -> covered >= 2 times (|winding| >= 2)
 *   `XOR` -> covered an odd number of times (odd parity)
 *
 * All three are rasterized from the exact per-pixel signed winding number (the
 * same scanline rasterizer used for the actual output in `drawShapesRef`), so
 * reference and actual share identical boundary sampling and the pixel diff
 * reflects only genuine geometry differences - not rasterizer disagreement.
 */
function drawBooleanRef(
        ctx: CanvasRenderingContext2D,
        loops: (number[][])[][],
        booleanOp: 'AND' | 'OR' | 'XOR') {

    const W = ctx.canvas.width;
    const winding = computeSignedWinding(loops, W);

    const inResult =
        booleanOp === 'OR'  ? (w: number) => w !== 0        // union
      : booleanOp === 'XOR' ? (w: number) => w % 2 !== 0    // odd parity
      :                       (w: number) => abs(w) >= 2;   // AND

    fillMask(ctx, W, p => inResult(winding[p]));
}


/**
 * Renders the actual `simplifyPaths` output using the SAME scanline winding
 * rasterizer as `drawBooleanRef`. A pixel is ink iff it lies inside (nonzero
 * winding of) any output shape - matching a per-shape `fill('nonzero')`
 * composited together, but with pixel sampling identical to the reference.
 */
function drawShapesRef(
        ctx: CanvasRenderingContext2D,
        shapes: (number[][])[][][]) {

    const W = ctx.canvas.width;

    const inside = new Uint8Array(W * W);
    for (const shape of shapes) {
        const winding = computeSignedWinding(shape, W);
        for (let p = 0; p < W * W; p++) {
            if (winding[p] !== 0) { inside[p] = 1; }
        }
    }

    fillMask(ctx, W, p => inside[p] === 1);
}


/** Paint the canvas black where `inside(p)` holds, transparent elsewhere. */
function fillMask(
        ctx: CanvasRenderingContext2D,
        W: number,
        inside: (p: number) => boolean) {

    (ctx as any).antialias = 'none';
    ctx.clearRect(0, 0, W, W);
    const out = ctx.getImageData(0, 0, W, W);
    const od = out.data;
    for (let p = 0, i = 0; i < od.length; i += 4, p++) {
        const on = inside(p);
        od[i] = 0; od[i + 1] = 0; od[i + 2] = 0; od[i + 3] = on ? 255 : 0;
    }
    ctx.putImageData(out, 0, 0);
}


/**
 * Computes the exact signed winding number per pixel via a scanline rasterizer
 * over the flattened directed edges. Unlike a per-loop nonzero fill, this
 * correctly accounts for self-intersecting loops (where a single path can wind
 * around a region more than once).
 *
 * Uses an active-edge table: each (non-horizontal) segment is bucketed by the
 * first scanline it is sampled on, and an `active` list is carried down the
 * rows so each scanline only visits the segments that actually cross it. This
 * is O(rows + total edge span) instead of O(rows * segments), which matters a
 * lot for large flattened shapes (thousands of beziers * FLATTEN_SEGMENTS).
 */
function computeSignedWinding(loops: (number[][])[][], W: number): Int32Array {
    const segs: number[][] = [];
    for (const loop of loops) { flattenLoop(FLATTEN_SEGMENTS, loop, segs); }

    // Bucket each non-horizontal segment by the first scanline it is active on.
    // A segment with vertical span [yTop, yBot) is sampled by row `y` (at
    // Y = y + 0.5) iff yTop <= Y < yBot, matching the half-open crossing test.
    const buckets: number[][][] = Array.from({ length: W }, () => []);
    for (const seg of segs) {
        const y0 = seg[1];
        const y1 = seg[3];
        if (y0 === y1) { continue; }  // horizontal: never crosses a scanline
        const yTop = y0 < y1 ? y0 : y1;
        let firstRow = Math.ceil(yTop - 0.5);
        if (firstRow < 0) { firstRow = 0; }
        if (firstRow >= W) { continue; }  // first sample lies below the canvas
        buckets[firstRow].push(seg);
    }

    const winding = new Int32Array(W * W);
    const crossings: { x: number; d: number }[] = [];
    const active: number[][] = [];
    for (let y = 0; y < W; y++) {
        const Y = y + 0.5;

        // Activate segments that begin being sampled on this row.
        const bucket = buckets[y];
        for (let k = 0; k < bucket.length; k++) { active.push(bucket[k]); }

        // Visit the active segments: emit a crossing for those spanning this
        // row and compact away those that have expired (Y >= yBot).
        crossings.length = 0;
        let writeIdx = 0;
        for (let k = 0; k < active.length; k++) {
            const seg = active[k];
            const y0 = seg[1];
            const y1 = seg[3];
            const yBot = y0 > y1 ? y0 : y1;
            if (Y >= yBot) { continue; }  // expired -> drop from active list
            active[writeIdx++] = seg;      // keep for subsequent rows

            const x0 = seg[0];
            const x1 = seg[2];
            const x = x0 + ((Y - y0) / (y1 - y0)) * (x1 - x0);
            crossings.push({ x, d: y1 > y0 ? 1 : -1 });
        }
        active.length = writeIdx;

        crossings.sort((a, b) => a.x - b.x);
        let w = 0, ci = 0;
        const row = y * W;
        for (let x = 0; x < W; x++) {
            const X = x + 0.5;
            while (ci < crossings.length && crossings[ci].x <= X) {
                w += crossings[ci].d; ci++;
            }
            winding[row + x] = w;
        }
    }
    return winding;
}


/** Supersampling factor per axis used by `countBooleanCoverageDiff`. */
const COVERAGE_SUPERSAMPLE = 4;


/**
 * Anti-aliased, boundary-tolerant pixel diff between the boolean reference (the
 * raw input winding) and the actual output (union of the reconstructed output
 * shapes).
 *
 * Each pixel is first classified by its centre sample; only pixels whose centre
 * classification disagrees are re-examined by S×S supersampling. Such a pixel is
 * counted only if the covered *fraction* differs by at least `threshold`. A
 * boundary pixel that is ~half covered in both images - i.e. sub-pixel straddle
 * between an input curve and its slightly different reconstructed output curve,
 * whose raw count grows with edge length - has near-equal coverage and is
 * ignored, while a genuine filled-area or missing-sliver error (≈full vs ≈empty
 * coverage) is still counted. This lets the diff bound be tightened to catch
 * real (even thin) geometry errors without tripping on unavoidable rasterization
 * straddle along long, near-diagonal edges.
 */
function countBooleanCoverageDiff(
        inputLoops: (number[][])[][],
        outputSets: (number[][])[][][],
        booleanOp: 'AND' | 'OR' | 'XOR',
        W: number,
        S = COVERAGE_SUPERSAMPLE,
        threshold = 0.5): number {

    const inResult =
        booleanOp === 'OR'  ? (w: number) => w !== 0
      : booleanOp === 'XOR' ? (w: number) => w % 2 !== 0
      :                       (w: number) => abs(w) >= 2;

    const refWinding = computeSignedWinding(inputLoops, W);
    const actInside = computeInsideUnion(outputSets, W);

    const refSegs: number[][] = [];
    for (const loop of inputLoops) { flattenLoop(FLATTEN_SEGMENTS, loop, refSegs); }
    const shapeSegs = outputSets.map(set => {
        const segs: number[][] = [];
        for (const loop of set) { flattenLoop(FLATTEN_SEGMENTS, loop, segs); }
        return segs;
    });

    const S2 = S * S;
    let n = 0;
    for (let y = 0; y < W; y++) {
        for (let x = 0; x < W; x++) {
            const p = y * W + x;
            const rc = inResult(refWinding[p]) ? 1 : 0;
            const ac = actInside[p];
            if (rc === ac) { continue; }  // identical at pixel centre -> not a candidate

            let refIn = 0, actIn = 0;
            for (let sy = 0; sy < S; sy++) {
                const Y = y + (sy + 0.5) / S;
                for (let sx = 0; sx < S; sx++) {
                    const X = x + (sx + 0.5) / S;
                    if (inResult(windingAt(refSegs, X, Y))) { refIn++; }
                    for (let si = 0; si < shapeSegs.length; si++) {
                        if (windingAt(shapeSegs[si], X, Y) !== 0) { actIn++; break; }
                    }
                }
            }
            if (abs(refIn - actIn) / S2 >= threshold) { n++; }
        }
    }

    return n;
}


/** Centre-sample mask: 1 where any output shape has nonzero winding. */
function computeInsideUnion(shapes: (number[][])[][][], W: number): Uint8Array {
    const inside = new Uint8Array(W * W);
    for (const shape of shapes) {
        const winding = computeSignedWinding(shape, W);
        for (let p = 0; p < W * W; p++) { if (winding[p] !== 0) { inside[p] = 1; } }
    }
    return inside;
}


/**
 * Signed winding number at an arbitrary point, via a horizontal ray cast toward
 * -x. Uses the same half-open [yTop, yBot) crossing rule as the scanline
 * rasterizer so centre samples agree exactly.
 */
function windingAt(segs: number[][], X: number, Y: number): number {
    let w = 0;
    for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        const y0 = seg[1], y1 = seg[3];
        if ((y0 <= Y) === (y1 <= Y)) { continue; }  // segment does not straddle Y
        const x = seg[0] + ((Y - y0) / (y1 - y0)) * (seg[2] - seg[0]);
        if (x <= X) { w += y1 > y0 ? 1 : -1; }
    }
    return w;
}


export { drawBooleanRef, drawShapesRef, countBooleanCoverageDiff }
