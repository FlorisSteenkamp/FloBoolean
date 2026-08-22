import type { X } from '../../get-critical-points/x.js';
import { drawFs } from 'flo-draw';
import { toP } from '../../utils/to-p.js';


function drawMinY(
        g: SVGGElement,
        x: X) {

    const p = toP(x.curve.ps, x.ri.t) ;

    const $elems = drawFs.crossHair(
        g, p, 'blue thin5 nofill', 0.5
    );
    
    return $elems;
}


export { drawMinY }
