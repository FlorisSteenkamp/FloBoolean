// declare const _debug_: Debug; 
// import type { Debug } from '../../../src/debug/debug.js';
// import type { Container } from '../../../src/containers/container.js';
// import { containerIsBasic } from '../../../src/containers/container-is-basic.js';
// import { getClosestDistanceToRect } from './get-closest-distance-to-rect.js';


// function logNearestInOut(g: SVGGElement, p: number[], showDelay = 1000) {
//     let bestContainer: Container;
//     let bestDistance = Infinity;

//     for (const container of _debug_.elems.container) {
//         for (const x of container.inOuts) {

//         }
//         const d = getClosestDistanceToRect(container.box, p);


        
//         if (d < bestDistance) {
//             bestContainer = container;
//             bestDistance = d;
//         }
//     }

//     console.log(`isBasic: ${containerIsBasic(bestContainer!)}`);
    
//     _debug_.fs.drawElem.container(/*_debug_.generated.*/g, bestContainer!, '', showDelay);
//     console.log(bestContainer!);
//     for (const x of bestContainer!.xs) {
//         //console.log('x', x.curve.ps.toString())
//     }
// }


// export { logNearestInOut }
