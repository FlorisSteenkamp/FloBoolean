import type { Curve } from '../../curve/curve.js';
import { drawFs } from 'flo-draw';
import { toP } from '../../utils/to-p.js';


function drawMinY(
        g: SVGGElement,
        pos: { curve: Curve, t: number, p: number[] }) {

    const p = toP(pos.curve.ps, pos.t) ;

    const $elems = drawFs.crossHair( 
        g, p, 'red thin10 nofill'
    );  
    
    return $elems;
}


export { drawMinY }
