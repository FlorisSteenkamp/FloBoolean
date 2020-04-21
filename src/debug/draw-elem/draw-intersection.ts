
import { drawCirclePercent } from './draw-circle-percent';
import { _X_ } from '../../x';


function drawIntersection(g: SVGGElement, x: _X_) {
    return [drawCirclePercent(g, x.x.box[0], 0.7, 'purple thin5 nofill')];
}


export { drawIntersection }
