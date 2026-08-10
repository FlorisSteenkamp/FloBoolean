import type { Container } from '../../containers/container.js';
import type { InOut } from '../../containers/in-out/in-out.js';
import { drawFs } from 'flo-draw';
import { iterBeziersToNextX } from '../../containers/get-beziers-to-next-x.js';
import { toP } from '../../utils/to-p.js';
import { getTs } from '../../containers/get-container-in-outs/get-in-outs-via-sides/get-ts copy.js';

const { round, log2 } = Math;


function drawContainer(
        g: SVGGElement,
        container: Container,
        classes?: string,
        delay = 0,
        drawBigBox = false) {

    const { box, bigBox, xs } = container;
    
    
    const scale = 2**(round(log2(container.box[1][0] - container.box[0][0])))*(2**-1);

    // intersections
    const $circles: SVGCircleElement[] = [];
    // for (let i=0; i<xs.length; i++) {
    //     const x = xs[i];
    //     // $circles.push(...drawFs.circle(g, { center: x.x.box[0], radius: scale/4 }, 'thin2 red nofill', delay));
    // }

    // text showing intersection ordering
    const $texts: SVGTextElement[] = [];
    const inOuts = container.inOuts;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i];
        // Place the marker where the in/out's curve crosses the box edge (this
        // is what determines its ordering), falling back to the intersection.
        const p = getInOutBoxCrossing(inOut, box) ?? inOut._x_.x.p;
        const color = inOut.dir === -1 ? 'red' : 'blue';
        const size = scale*(1 + (0.5*i));
        if (inOut.idx !== undefined) {
            $texts.push(...drawFs.text(g, p, inOut.idx!.toString(), scale/2, `thin5 ${color}`, delay));
        }
        $circles.push(...drawFs.dot(g, p, size/8, `thin5 nofill ${color}`, delay)); 
    }

    // container rect
    const $outline = drawFs.rect(g, box, 'thin2 blue nofill', delay);
    const $bigbox = drawBigBox
        ? drawFs.rect(g, bigBox, 'thin2 red nofill', delay)
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
        inOut: InOut,
        box: number[][]): number[] | undefined {

    const forward = inOut.dir === 1;
    const sides = getBoxSides(box);

    for (const { ps, ts } of iterBeziersToNextX(inOut._x_, forward)) {
        const ts_ = ts[0] < ts[1] ? ts : [ts[1], ts[0]];
        for (const side of sides) {
            const xs = getTs(ps, side, ts_);
            if (xs.length > 0) {
                return toP(side, xs[0].sideX.ri.t);
            }
        }
    }

    return undefined;
}


export { drawContainer }
