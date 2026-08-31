import { evalDeCasteljauDd } from 'flo-bezier3';

const { abs } = Math;


/** Number of line segments used to flatten each bezier for winding rasterization. */
const FLATTEN_SEGMENTS = 128;


/**
 * Minimal structural subset of a 2D canvas rendering context shared by both the
 * browser (`CanvasRenderingContext2D`) and node-canvas, so this module needs no
 * dependency on the node `canvas` package's types.
 */
interface RasterCtx {
    readonly canvas: { readonly width: number };
    clearRect(x: number, y: number, w: number, h: number): void;
    getImageData(sx: number, sy: number, sw: number, sh: number): { data: Uint8ClampedArray };
    putImageData(imagedata: { data: Uint8ClampedArray }, dx: number, dy: number): void;
}


/** Flattens one loop into directed line segments appended to `segs`. */
function flattenLoop(
        numSegments: number,
        loop: (number[][])[],
        segs: number[][]) {

    let first: [number, number] | null = null;
    let prev: [number, number] | null = null;
    for (const ps of loop) {
        if (first === null) {
            first = [ps[0][0], ps[0][1]];
            prev = first;
        }
        for (let i = 1; i <= numSegments; i++) {
            const pt = evalDeCasteljauDd(ps, [0, i / numSegments]).map(c => c[1]) as [number, number];
            segs.push([prev![0], prev![1], pt[0], pt[1]]);
            prev = pt;
        }
    }
    // Close the loop if it isn't already closed.
    if (first && prev && (prev[0] !== first[0] || prev[1] !== first[1])) {
        segs.push([prev[0], prev[1], first[0], first[1]]);
    }
}


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
        ctx: RasterCtx,
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


/** Paint the canvas black where `inside(p)` holds, transparent elsewhere. */
function fillMask(
        ctx: RasterCtx,
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


export {
    FLATTEN_SEGMENTS,
    flattenLoop,
    computeSignedWinding,
    windingAt,
    fillMask,
    drawBooleanRef,
}
export type { RasterCtx }
