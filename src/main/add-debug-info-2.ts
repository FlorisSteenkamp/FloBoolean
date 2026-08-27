declare const _debug_: Debug; 
import type { Debug, Timing } from '../debug/debug.js';
import type { Mutable } from '../utils/mutable.js';
import type { Loop } from '../shape/loop.js';

// the imports below is used in the test cases - see code below
import { getShapeCentroid } from '../shape/get-shape-centroid.js';
import { getShapeBounds } from '../calc-paths/get-shape-bounds.js';
import { getShapeArea$ } from '../shape/get-shape-area.js';


function addDebugInfo2(loopss: Loop[][]) {
    if (typeof _debug_ === 'undefined') { return; }

    for (const loops of loopss) {
        _debug_.elems.loop.push(...loops);
        _debug_.elems.loops.push(loops);
    }

    if (typeof _debug_ !== 'undefined') {
        (_debug_.timing as Mutable<Timing>).simplifyPaths =
            performance.now() - _debug_.timing.timingStart - _debug_.timing.normalize;
    }

    // ---------------------------------------------------------------------
    // Don't delete below commented lines - it is for creating test cases.
    // if (typeof document === 'undefined') { return; }
    // let g = document.getElementsByTagName('g')[0];
    // let invariants = loopss.map(loops => {
    //    return loops.map(loop => {
    //        let centroid = getShapeCentroid(loop.beziers);
    //        let area     = -getShapeArea(loop.beziers);
    //        let bounds   = getShapeBounds(loop.beziers);
    //        //drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 0);
    //        return { centroid, area, bounds };
    //    });
    // });
    // console.log(JSON.stringify(invariants, undefined, '    '));
    // ---------------------------------------------------------------------
}


export { addDebugInfo2 }
