import { drawCirclePercent } from './draw-circle-percent.js';
import { _X_ } from '../../-x-.js';


function drawIntersection(g: SVGGElement, x: _X_) {
    return [drawCirclePercent(g, x.x.box[0], 0.7, 'purple thin5 nofill')];
}


export { drawIntersection }
