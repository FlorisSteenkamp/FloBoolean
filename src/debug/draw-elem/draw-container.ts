import type { Container } from '../../containers/container.js';
import type { In, Out } from '../../containers/in-out/in-out.js';
import { drawFs } from 'flo-draw';
import { iterBeziersToNextX } from '../../containers/get-beziers-to-next-x.js';
import { toP } from '../../utils/to-p.js';
import { getTs } from '../../containers/get-container-in-outs/get-in-outs-via-sides/get-ts.js';

const { round, log2 } = Math;


function drawContainer(
        g: SVGGElement,
        container: Container,
        classes?: string,
        delay = 0,
        drawBigBox = false) {

    const { box, bigBox } = container;
    const scale = 2**(round(log2(container.box[1][0] - container.box[0][0])))*(2**-1);

    // intersections
    const $circles: SVGCircleElement[] = [];
    // for (let i=0; i<xs.length; i++) {
    //     const x = xs[i];
    //     // $circles.push(...drawFs.circle(g, { center: x.x.box[0], radius: scale/4 }, 'thin2 red nofill', delay));
    // }

    // text showing intersection ordering
    const $texts: SVGTextElement[] = [];
    const placed: number[][] = [];  // label anchor points already used
    const inOuts = container.inOuts;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i];
        // Place the marker where the in/out's curve crosses the box edge (this
        // is what determines its ordering), falling back to the intersection.
        const p = getInOutBoxCrossing(inOut, box) ?? inOut._x_.x.p;
        const color = inOut.dir === -1 ? 'red' : 'blue';
        const size = scale*(1 + (0.5*i));
        if (inOut.idx !== undefined) {
            // If a label already sits at ~this point (e.g. the paired in & out),
            // stack this one lower so they don't render on top of each other.
            const overlaps = placed.filter(q =>
                Math.hypot(q[0] - p[0], q[1] - p[1]) < scale/4
            ).length;
            placed.push(p);
            const tp = overlaps === 0 ? [p[0] + scale/3, p[1]] : [p[0] + scale/3, p[1] + overlaps*(scale/2)];
            $texts.push(...drawFs.text(g, tp, inOut.idx!.toString(), scale/2, `thin5 ${color}`, delay));
        }
        $circles.push(...drawFs.dot(g, p, size/8, `thin5 nofill ${color}`, delay)); 
    }

    // container rect
    const $outline = drawFs.rect(g, box, 'thin2 blue nofill', delay);
    const $bigbox = drawBigBox
        ? drawFs.rect(g, bigBox, 'thin5 red nofill', delay)
        : [];

    return [
        ...$outline,
        ...$bigbox,
        ...$circles,
        ...$texts
    ];
}


/**
 * Builds the 4 axis-aligned edges of `box` in the standard side order:
 * 0 top, 1 left, 2 bottom, 3 right (anti-clockwise from top-right).
 *
 * (Duplicated locally to keep all debug-drawing code self-contained.)
 */
function getBoxSides(box: number[][]): number[][][] {
    const [[minX,minY], [maxX,maxY]] = box;

    return [  // anti-clockwise from top right (left-handed coordinate system)
        [[maxX, minY], [minX, minY]],  // top      (right to left)
        [[minX, minY], [minX, maxY]],  // left     (top to bottom)
        [[minX, maxY], [maxX, maxY]],  // bottom   (left to right)
        [[maxX, maxY], [maxX, minY]]   // right    (bottom to top)
    ];
}


/**
 * Debug helper: returns the point where the `inOut`'s loop curve first crosses
 * an edge of the given axis-aligned `box`, following the loop outward from the
 * intersection in the `inOut`'s direction, or `undefined` if none is found.
 */
function getInOutBoxCrossing(
        inOut: In|Out,
        box: number[][]): number[] | undefined {

    // The loop direction is unchanged even when `dir` was flipped in `rerun`
    // (`swapped`), so in that case walk the loop the opposite way.
    const forward = (inOut.dir === 1) !== Boolean(inOut.swapped);
    const sides = getBoxSides(box);

    for (const { curve, ts } of iterBeziersToNextX(inOut._x_, forward)) {
        const startT = ts[0];  // param at the piece's start (nearest the intersection)
        const ts_ = ts[0] < ts[1] ? ts : [ts[1], ts[0]];

        let best: number[] | undefined = undefined;
        let bestDist = Infinity;
        for (let i=0; i<sides.length; i++) {
            const side = sides[i];
            const sideCrossing = getTs(curve, side, ts_, i);
            if (sideCrossing === undefined) { continue; }

            // `getTs` finds crossings with the side's infinite line; keep only
            // those actually on the segment (side param within [0,1]).
            const tSide = sideCrossing.riSide.t;
            if (tSide < -1e-6 || tSide > 1 + 1e-6) { continue; }

            // Among segment crossings, take the one nearest the piece start,
            // i.e. the edge the loop exits through first.
            const tCurve = sideCrossing.xPs.ri.t;
            const dist = Math.abs(tCurve - startT);
            if (dist < bestDist) {
                bestDist = dist;
                best = toP(sideCrossing.ps, tCurve);
            }
        }

        if (best !== undefined) { return best; }
    }

    return undefined;
}


export { drawContainer }
