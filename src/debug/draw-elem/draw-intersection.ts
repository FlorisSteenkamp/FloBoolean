import type { X } from '../../get-critical-points/x.js';
import { drawCirclePercent } from './draw-circle-percent.js';


function drawIntersection(g: SVGGElement, x: X) {
    return [drawCirclePercent(g, x.p, 0.7, 'purple thin5 nofill')];
}


export { drawIntersection }
