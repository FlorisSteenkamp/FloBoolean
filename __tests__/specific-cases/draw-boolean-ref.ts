import {
    FLATTEN_SEGMENTS,
    flattenLoop,
    computeSignedWinding,
    windingAt,
    fillMask,
    drawBooleanRef,
} from '../../demo/src/page/winding.js';
import type { RasterCtx } from '../../demo/src/page/winding.js';

const { abs } = Math;


/**
 * Renders the actual `simplifyPaths` output using the SAME scanline winding
 * rasterizer as `drawBooleanRef`. A pixel is ink iff it lies inside (nonzero
 * winding of) any output shape - matching a per-shape `fill('nonzero')`
 * composited together, but with pixel sampling identical to the reference.
 */
function drawShapesRef(
        ctx: RasterCtx,
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
 *
 * When `supersample` is false the supersampling is skipped and the raw
 * centre-sample disagreement count is returned instead.
 */
function countBooleanCoverageDiff(
        inputLoops: (number[][])[][],
        outputSets: (number[][])[][][],
        booleanOp: 'AND' | 'OR' | 'XOR',
        W: number,
        supersample: boolean,
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

            if (!supersample) { n++; continue; }  // raw centre-sample diff

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


export { drawBooleanRef, drawShapesRef, countBooleanCoverageDiff }
