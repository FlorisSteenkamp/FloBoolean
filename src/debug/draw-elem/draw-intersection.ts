import { drawCirclePercent } from './draw-circle-percent.js';
import { __X__ } from '../../-x-.js';


function drawIntersection(g: SVGGElement, x: __X__) {
    return [drawCirclePercent(g, x.x.box[0], 0.7, 'purple thin5 nofill')];
}


export { drawIntersection }
