import { drawFs } from 'flo-draw';
import { Container } from '../../container.js';


function drawContainer(g: SVGGElement, container: Container, classes?: string, delay = 0) {
    const rect = container.box;
    const xs = container.xs;
    const scale = 2**0*0.0125;

    // intersections
    const $circles: SVGCircleElement[] = [];
    for (let i=0; i<xs.length; i++) {
        const x = xs[i];
        $circles.push(...drawFs.circle(g, { center: x.x.box[0], radius: scale }, 'thin2 red nofill', delay));
    }

    // text showing intersection ordering
    const $texts: SVGTextElement[] = [];
    const inOuts = container.inOuts;
    for (let i=0; i<inOuts.length; i++) {
        const inOut = inOuts[i];
        const p = inOut.p.slice();

        const color = inOut.dir === -1 ? 'red' : 'blue';
        const size = scale*(1 + (0.5*i));
        if (inOut.idx !== undefined) {
            $texts.push(...drawFs.text(g, p, inOut.idx!.toString(), scale*8, `thin5 nofill ${color}`, delay));
        }
        $circles.push(...drawFs.dot(g, inOut.p, size, `thin2 nofill ${color}`, delay)); 
    }

    // container rect
    const $outline = drawFs.rect(g, rect, 'thin2 blue nofill', delay);

    return [...$outline, ...$circles, ...$texts];
}


export { drawContainer }
