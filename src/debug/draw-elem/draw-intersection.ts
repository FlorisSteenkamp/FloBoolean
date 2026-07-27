import type { __X__ } from '../../get-critical-points/-x-.js';
import { drawCirclePercent } from './draw-circle-percent.js';


function drawIntersection(g: SVGGElement, x: __X__) {
    return [drawCirclePercent(g, x.x.box[0], 0.7, 'purple thin5 nofill')];
}


export { drawIntersection }
