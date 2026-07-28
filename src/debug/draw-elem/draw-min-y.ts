import type { Curve } from '../../curve/curve.js';
import { evalDeCasteljau } from 'flo-bezier3';
import { drawFs } from 'flo-draw';


function drawMinY(
        g: SVGGElement,
        pos: { curve: Curve, t: number, p: number[] }) {

    const p = evalDeCasteljau(pos.curve.ps, pos.t) ;

    const $elems = drawFs.crossHair( 
        g, p, 'red thin10 nofill'
    );  
    
    return $elems;
}


export { drawMinY }
