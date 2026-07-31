import type { CanvasRenderingContext2D } from 'canvas';
import { addLoopToPath } from './add-loop-to-path.js';
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
 * `OR` and `XOR` are rendered natively by the canvas nonzero / even-odd fill
 * rules (both handle self-intersecting paths exactly). `AND` needs the actual
 * winding count, which no canvas fill rule exposes, so it is rasterized from a
 * per-pixel signed winding number.
 */
function drawBooleanRef(
        ctx: CanvasRenderingContext2D,
        loops: (number[][])[][],
        booleanOp: 'AND' | 'OR' | 'XOR') {

    const W = ctx.canvas.width;
    // Disable anti-aliasing so coverage is a clean per-pixel in/out test.
    (ctx as any).antialias = 'none';
    ctx.clearRect(0, 0, W, W);
    ctx.fillStyle = 'black';

    if (booleanOp === 'OR' || booleanOp === 'XOR') {
        // Even-odd parity equals winding parity, so XOR == even-odd fill.
        ctx.beginPath();
        for (const loop of loops) { addLoopToPath(ctx, loop); }
        ctx.fill(booleanOp === 'OR' ? 'nonzero' : 'evenodd');
        return;
    }

    // AND: |winding| >= 2, from the exact per-pixel signed winding number.
    const winding = computeSignedWinding(loops, W);
    const out = ctx.getImageData(0, 0, W, W);
    const od = out.data;
    for (let p = 0, i = 0; i < od.length; i += 4, p++) {
        const inside = abs(winding[p]) >= 2;
        od[i] = 0; od[i + 1] = 0; od[i + 2] = 0; od[i + 3] = inside ? 255 : 0;
    }
    ctx.putImageData(out, 0, 0);
}


/**
 * Computes the exact signed winding number per pixel via a scanline rasterizer
 * over the flattened directed edges. Unlike a per-loop nonzero fill, this
 * correctly accounts for self-intersecting loops (where a single path can wind
 * around a region more than once).
 */
function computeSignedWinding(loops: (number[][])[][], W: number): Int32Array {
    const segs: number[][] = [];
    for (const loop of loops) { flattenLoop(FLATTEN_SEGMENTS, loop, segs); }

    const winding = new Int32Array(W * W);
    const crossings: { x: number; d: number }[] = [];
    for (let y = 0; y < W; y++) {
        const Y = y + 0.5;
        crossings.length = 0;
        for (const [x0, y0, x1, y1] of segs) {
            // Half-open crossing test avoids double-counting shared vertices.
            if ((y0 <= Y) === (y1 <= Y)) { continue; }
            const x = x0 + ((Y - y0) / (y1 - y0)) * (x1 - x0);
            crossings.push({ x, d: y1 > y0 ? 1 : -1 });
        }
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


export { drawBooleanRef }
