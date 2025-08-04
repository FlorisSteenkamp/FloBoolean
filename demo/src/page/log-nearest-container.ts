declare const _debug_: Debug; 

import { Debug } from '../../../src/debug/debug';
import { Container, containerIsBasic } from '../../../src/container';
import { squaredDistanceBetween } from 'flo-vector2d';


// import { getClosestSquareDistanceToRect } from 'flo-bezier3';
// TODO - this function was somehow lost and a sloppy version recreated below
// to get it working
function getClosestSquareDistanceToRect(rect: number[][], p: number[]) {
    const tl = rect[0];
    const br = rect[1];
    const ps = [tl, br];

    return Math.min(...ps.map(p_ => squaredDistanceBetween(p,p_)));
}


function logNearestContainer(g: SVGGElement, p: number[], showDelay = 1000) {
    let bestContainer: Container;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const container of _debug_.generated.elems.container) {
        const dSquared = getClosestSquareDistanceToRect(container.box, p);
        
        if (dSquared < bestDistance) {
            bestContainer = container;
            bestDistance = dSquared;
        }
    }

    console.log(`isBasic: ${containerIsBasic(bestContainer!)}`);
    
    _debug_.fs.drawElem.container(/*_debug_.generated.*/g, bestContainer!, '', showDelay);
    console.log(bestContainer!);
    for (const x of bestContainer!.xs) {
        //console.log('x', x.curve.ps.toString())
    }
}


export { logNearestContainer };
