declare const _debug_: Debug; 
import { getBoundingBoxTight, getBoundingHull } from 'flo-bezier3';
import { Debug } from '../debug/debug.js';
import { getBoundingBox$ } from '../get-bounding-box-.js';
import { loopsToSvgPathStr } from '../svg/loops-to-svg-path-str.js';


function addDebugInfo1(bezierLoops: number[][][][]) {
    if (typeof _debug_ === 'undefined') { return; }

    // Modifies the displayed SVG to reflect changes caused by `normalizeLoops`.
    // if (typeof document !== 'undefined') { 
    //     const pathStr = loopsToSvgPathStr(bezierLoops); 
    //     const $svg = document.getElementsByClassName('shape')[0]; 
    //     $svg.setAttributeNS(null, 'd', pathStr); 
    // }

    
    for (const loop of bezierLoops) {
        _debug_.elems.loopPre.push(...bezierLoops);
        _debug_.elems.loopsPre.push(bezierLoops);

        for (const ps of loop) {
            const lbb   = getBoundingBox$(ps);
            const tbb   = getBoundingBoxTight(ps);
            const bhull = getBoundingHull(ps, false)!;
            _debug_.elems.bezier_          .push(ps);
            _debug_.elems.looseBoundingBox_.push(lbb);
            _debug_.elems.tightBoundingBox_.push(tbb);
            _debug_.elems.boundingHull_    .push(bhull);
        }
    }
}


export { addDebugInfo1 }
