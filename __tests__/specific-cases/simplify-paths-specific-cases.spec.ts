import { test, expect } from '@jest/globals';
import type { Canvas, CanvasRenderingContext2D } from 'canvas';
import { evalDeCasteljauDd } from 'flo-bezier3';
import { getPathFromFile } from '../helpers/get-path-from-file.js';
import { makeTolerance } from '../helpers/make-tolerance.js';
import { checkShapes } from '../helpers/check-shapes.js';
import { simplifyPaths } from '../../src/main/simplify-paths.js';
import { enableDebugForBooleanOp } from '../../src/debug/debug.js';
import { getPathsFromStr } from '../../src/svg/get-paths-from-str.js';
import { boolean } from '../../src/boolean/boolean.js';
import { createCanvas } from 'canvas';
import { translateShape } from '../../src/shape/translate-shape.js';
import { getShapesControlPointBox } from './get-shapes-control-point-box.js';
import { scaleShape } from '../../src/shape/scale-shape.js';
import { countInk } from './count-ink.js';
import { countThickDiff } from './count-thick-diff.js';
import { drawBooleanRef, drawShapesRef, countBooleanCoverageDiff } from './draw-boolean-ref.js';
import { Loop } from '../../src/shape/loop.js';
import { reverseShapeOrientation } from '../../src/shape/reverse-shape-orientation.js';

const { max, min, ceil, log2, abs } = Math;


const CANVAS_WIDTH_HEIGHT = 1024;
const CANVAS_WIDTH_HEIGHT_EXP = log2(CANVAS_WIDTH_HEIGHT);


/**
 * Max allowed post-erosion pixel difference between the reference and actual
 * renders. Absorbs tiny residuals at near-degenerate self-intersections; well
 * below the magnitude of a genuine filled-area difference.
 */
const MAX_THICK_DIFF = 0;
// Anti-aliased boundary-tolerant difference bound (see `countBooleanCoverageDiff`).
// A pixel only counts when its supersampled coverage differs by >= 50% between
// the reference and the actual output, so unavoidable sub-pixel straddle along
// long near-diagonal edges (which grows with edge length - e.g. `complexish2`
// hit ~141px under the old raw centre-sample diff) no longer registers, while a
// genuine filled-area or thin-sliver error still does. All current fixtures are
// 0; the small bound leaves headroom for near-degenerate self-intersections.
const MAX_DIFF = 4;

// Flip to `true` to print a per-shape/op `thick` vs `raw` diff table while
// running the tests (handy for choosing `MAX_THICK_DIFF` / `MAX_DIFF`).
const LOG_DIFFS = true;
// Only log rows whose raw diff is at least this, to hide near-zero noise.
const LOG_DIFF_MIN = 1;

test('`simplifyPaths` specific cases', function() {
    const canvas = createCanvas(CANVAS_WIDTH_HEIGHT, CANVAS_WIDTH_HEIGHT);
    const ctx = canvas.getContext('2d');

    updDebugGlobal(true);

    testIt('confuse1');
    // testIt('two-squares');    // two-squares -> should boolean correctly'
    // testIt('three-squares');    // three-squares -> should boolean correctly'
    // testIt('snuggle-1');   // snuggle-1 -> should decompose correctly (and snuggly)'
    // testIt('multi-level-reversed-orientation');    // three-squares -> should boolean correctly'
    // testIt('few-xs-at-min-y');  // multiple intersections at minimum y value -> should decompose correctly'
    // testIt('multiple-xs-at-min-y');  // multiple intersections at minimum y value -> should decompose correctly'
    // testIt('woodland2');      // complex shape -> should decompose correctly'
    // testIt('woodland');      // complex shape -> should decompose correctly'
    // testIt('complex6');      // complex shape -> should decompose correctly'
    // testIt('complex4');      // complex shape -> should decompose correctly'
    // testIt('complex3');      // complex shape -> should decompose correctly'
    // testIt('complex2');     // complex shape -> should decompose correctly'
    // testIt('complex');      // complex shape -> should decompose correctly'
    // testIt('koldat-again');     // koldat-again -> edge case test'
    // testIt('square');           // simple square -> should decompose correctly (no decompisition)'
    // testIt('complexish');  // somewhat complex shape -> should decompose correctly'
    // testIt('B');           // B shape with quad beziers -> should decompose correctly'
    // testIt('same-k-family-lines');  // shape with overlapping beziers (lines) in same k family -> should decompose correctly'
    // testIt('multi-level-reversed-orientation');  // shape with multiple levels of both way oriented loops -> should decompose correctly'
    // testIt('holy-poly');  // polygon with 3 simple holes -> should decompose correctly'
    // testIt('f');  // f shape with interface intersections -> should decompose correctly'
    // testIt('split-shape-lines');  // split two shapes into two different shapes -> should decompose correctly'
    // testIt('tiny-min-y-loop');  // tiny loop at minimum y -> should decompose correctly'
    // testIt('new1');         // edge case -> should decompose correctly'
    // testIt('new2');         // edge case that caused same bug as bold-b -> should decompose correctly'
    // testIt('bold-b');       // edge case that caused bug -> should decompose correctly'
    // testIt('koldat51');     // koldat51 -> edge case test'
    // testIt('koldat52');     // koldat52 -> edge case test where `takenLoops` is important to be kept'
    // testIt('complexish2');  // complexish2 -> should decompose correctly'
    // testIt('complexish3');  // complexish3 -> should decompose correctly'

    function testIt(
            fileName: string) {

        // console.log(fileName);
        const { bezierLoops, invariants } = getPathFromFile(fileName);
        // bezierLoops = bezierLoops.map(reverseShapeOrientation);

        //-------------
        // Direct test
        //-------------
        for (const booleanOp of ['OR']) {
            if (invariants.length === 0) {
                continue;  // no invariants to check against
            }

            const booleanOp_ = booleanOp as 'OR' | 'AND' | 'XOR';

            const loopss = simplifyPaths(bezierLoops, {
                booleanOp: booleanOp_
            });
        
            const tolerancePower = -20;
            const tolerance = makeTolerance(tolerancePower, bezierLoops);
            expect(
                checkShapes(fileName, loopss, invariants, tolerance),
            ).toBe(true);
        }

        //-------------
        // Pixel test
        //-------------
        // for (const booleanOp of ['OR','AND','XOR']) {
        const ink: Record<string, number> = {};
        for (const booleanOp of ['OR', 'AND', 'XOR']) {
            const booleanOp_ = booleanOp as 'OR' | 'AND' | 'XOR';
            let loopss: Loop[][];
            try {
                loopss = simplifyPaths(bezierLoops, {
                    booleanOp: booleanOp_
                });
            } catch (e) {
                console.error(`Thrown for shape: ${fileName}`);
                throw e;
            }

            // Group each output shape's loops together (outer + holes) so
            // that holes render correctly via the nonzero winding rule.
            const outputSets = loopss.map(loops => loops.map(loop => loop.beziers));
            ink[booleanOp_] = pixelTest(ctx, fileName, booleanOp_, bezierLoops, outputSets);
        }

        // OR (union, winding !== 0) is a superset of both XOR (odd winding) and
        // AND (|winding| >= 2), so it covers at least as much area as either.
        // XOR and AND are different regions and are not orderable relative to
        // each other in general (e.g. for nested, mixed-orientation loops).
        if (ink.OR !== undefined && ink.XOR !== undefined && ink.AND !== undefined) {
            expectForShape(`${fileName} (OR >= XOR)`, () => expect(ink.OR >= ink.XOR).toBe(true));
            expectForShape(`${fileName} (OR >= AND)`, () => expect(ink.OR >= ink.AND).toBe(true));
        }
    }
});


/**
 * Runs a Jest assertion and, on failure, logs which shape (and boolean op)
 * the failure belongs to before rethrowing so the test still fails.
 */
function expectForShape(label: string, assert: () => void) {
    try {
        assert();
    } catch (err) {
        console.error(`Assertion failed for shape: ${label}`);
        throw err;
    }
}


function pixelTest(
        ctx: CanvasRenderingContext2D,
        fileName: string,
        booleanOp: 'AND' | 'OR' | 'XOR',
        inputLoops: (number[][])[][],
        outputSets: (number[][])[][][]): number {

    const outputLoops = outputSets.flat();

    //--------------------------------------------------------------------------
    const [[minX,minY],[maxX,maxY]] = getShapesControlPointBox([...inputLoops, ...outputLoops]);
    const shapesCenter = [(minX + maxX) / 2, (minY + maxY) / 2];
    const maxShapeDim = max(maxX - minX, maxY - minY);

    const maxCoordinate = max(maxShapeDim)/2;
    const expMax = ceil(log2(maxCoordinate));
    // Fit the *full* shape dimension into the canvas (kept a power of two so the
    // reference and actual images stay aligned to the same pixel grid). The
    // `- 1` accounts for `maxCoordinate` being the half-dimension.
    const scale = 2**(CANVAS_WIDTH_HEIGHT_EXP - 1 - expMax);

    // Move a loop to the origin, scale it to the canvas, then translate to the
    // canvas centre so the whole shape is in view (rather than centred on the
    // canvas origin, which would clip everything left of / above the centre).
    const canvasCentre = CANVAS_WIDTH_HEIGHT / 2;
    const tf = (loop: (number[][])[]) =>
        translateShape(
            [canvasCentre, canvasCentre],
            scaleShape(scale, translateShape(shapesCenter.map(c => -c), loop))
        );
    //--------------------------------------------------------------------------


    // Reference image: the boolean of the raw input loops, rendered using
    // the canvas compositing that corresponds to the boolean operation.
    drawBooleanRef(ctx, inputLoops.map(tf), booleanOp);
    const imgData1 = ctx.getImageData(0, 0, CANVAS_WIDTH_HEIGHT, CANVAS_WIDTH_HEIGHT);

    // Actual image: the `simplifyPaths` output, rasterized with the SAME
    // scanline winding rasterizer as the reference so boundary sampling matches.
    drawShapesRef(ctx, outputSets.map(set => set.map(tf)));
    const imgData2 = ctx.getImageData(0, 0, CANVAS_WIDTH_HEIGHT, CANVAS_WIDTH_HEIGHT);

    expectForShape(`${fileName} ${booleanOp} (image width)`, () => expect(imgData1.width).toBe(imgData2.width));
    expectForShape(`${fileName} ${booleanOp} (image height)`, () => expect(imgData1.height).toBe(imgData2.height));
    expectForShape(`${fileName} ${booleanOp} (image data length)`, () => expect(imgData1.data.length).toBe(imgData2.data.length));
    expectForShape(`${fileName} ${booleanOp} (image data length === 4 * w*h)`, () => expect(imgData1.data.length === 4 * CANVAS_WIDTH_HEIGHT**2).toBe(true));

    // Ensure something was actually drawn in both images
    const inkReference = countInk(imgData1);
    const inkActual = countInk(imgData2);
    if (booleanOp !== 'AND') {
        expectForShape(`${fileName} ${booleanOp} (inkReference > 0)`, () => expect(inkReference > 0).toBe(true));
        expectForShape(`${fileName} ${booleanOp} (inkActual > 0)`, () => expect(inkActual > 0).toBe(true));
    }

    // Compare the reference and actual images. The output loops are
    // reconstructed (with recomputed bezier boundaries) so
    // their edges can land up to a pixel away from the raw input-loop edges.
    // We therefore ignore purely 1px-thick boundary differences (anti-aliasing
    // / rasterization) by eroding the per-pixel difference mask: a differing
    // pixel only counts as a real error if all 8 of its neighbours also differ
    // (i.e. the difference is a filled region, not a thin edge).
    const thickDiff = countThickDiff(
        imgData1, imgData2, CANVAS_WIDTH_HEIGHT, CANVAS_WIDTH_HEIGHT
    );

    // Boundary-tolerant, anti-aliased difference: supersamples only the pixels
    // whose centre classification disagrees and counts one only if its covered
    // fraction differs by >= 50%. This ignores sub-pixel edge straddle (whose raw
    // count scales with edge length) while still catching real filled-area / thin
    // errors. Bounded by the tight `MAX_DIFF`.
    const diff = countBooleanCoverageDiff(
        inputLoops.map(tf), outputSets.map(set => set.map(tf)),
        booleanOp, CANVAS_WIDTH_HEIGHT
    );

    if (LOG_DIFFS && diff >= LOG_DIFF_MIN) {
        console.log(`DIFF ${fileName.padEnd(28)} ${booleanOp.padEnd(3)}  thick=${String(thickDiff).padStart(5)}  raw=${String(diff).padStart(5)}`);
    }

    // A tiny residual (a handful of px) can survive erosion at near-degenerate
    // self-intersections where the winding parity of a sub-pixel pocket is
    // ambiguous at raster resolution (e.g. `complex` XOR). Genuine filled-area
    // differences are far larger (hundreds+ px), so this small absolute
    // tolerance distinguishes acceptable rasterization noise from real bugs.
    expectForShape(`${fileName} ${booleanOp} (thickDiff <= ${MAX_THICK_DIFF})`, () => expect(thickDiff).toBeLessThanOrEqual(MAX_THICK_DIFF));
    expectForShape(`${fileName} ${booleanOp} (diff <= ${MAX_DIFF})`, () => expect(diff).toBeLessThanOrEqual(MAX_DIFF));

    // Return the amount of ink (non-transparent pixels) used by the output.
    return inkActual;
}


function updDebugGlobal(debugOn: boolean) {
    (globalThis as any)._debug_ = {};

    // enableDebugDrawFs(debugOn);
    enableDebugForBooleanOp(debugOn);

    // console shortcut
    (globalThis as any).d = (globalThis as any)._debug_;
}
