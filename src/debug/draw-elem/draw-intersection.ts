import type { _X_ } from '../../get-critical-points/-x-.js';
import { drawCirclePercent } from './draw-circle-percent.js';


function drawIntersection(g: SVGGElement, x: _X_) {
    return [drawCirclePercent(g, x.x.p, 0.7, 'purple thin5 nofill')];
}


export { drawIntersection }
