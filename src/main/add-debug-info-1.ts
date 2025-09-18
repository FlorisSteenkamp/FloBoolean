declare const _debug_: Debug; 

import { getBoundingBoxTight, getBoundingHull } from 'flo-bezier3';
import { Debug } from '../debug/debug.js';
import { getBoundingBox_ } from '../get-bounding-box-.js';
import { loopsToSvgPathStr } from '../svg/loops-to-svg-path-str.js';


function addDebugInfo1(loops: number[][][][]) {
    if (typeof _debug_ === 'undefined') { return; }

    // Modifies the displayed SVG to reflect changes caused by `normalizeLoops`.
    if (typeof document !== 'undefined') { 
        const pathStr = loopsToSvgPathStr(loops); 
        const $svg = document.getElementsByClassName('shape')[0]; 
        $svg.setAttributeNS(null, 'd', pathStr); 
    }

    
    for (const loop of loops) {
        _debug_.generated.elems.loopPre.push(...loops);
        _debug_.generated.elems.loopsPre.push(loops);

        for (const ps of loop) {
            const lbb   = getBoundingBox_(ps);
            const tbb   = getBoundingBoxTight(ps);
            const bhull = getBoundingHull(ps, false)!;
            _debug_.generated.elems.bezier_          .push(ps);
            _debug_.generated.elems.looseBoundingBox_.push(lbb);
            _debug_.generated.elems.tightBoundingBox_.push(tbb);
            _debug_.generated.elems.boundingHull_    .push(bhull);
        }
    }
}


export { addDebugInfo1 }
