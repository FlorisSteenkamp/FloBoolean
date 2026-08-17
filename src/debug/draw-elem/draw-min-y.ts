import type { _X_ } from '../../get-critical-points/-x-.js';
import { drawFs } from 'flo-draw';
import { toP } from '../../utils/to-p.js';


function drawMinY(
        g: SVGGElement,
        x: _X_) {

    const p = toP(x.curve.ps, x.x.ri.t) ;

    const $elems = drawFs.crossHair( 
        g, p, 'red thin10 nofill'
    );  
    
    return $elems;
}


export { drawMinY }
