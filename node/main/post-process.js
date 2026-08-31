import { compareLoopByMinY } from '../calc-paths/order-loop-ascending-by-min-y.js';
import { loopFromBeziers } from '../shape/loop-from-beziers.js';
import { addDebugInfo2 } from './add-debug-info-2.js';
import { filterLoopsByMinAllowedArea } from './filter-loops-by-min-allowed-area.js';
import { timeFunctionCalls } from '../utils/time-function-call.js';
import { bezierPieceToBezier } from 'flo-bezier3';
import { reverseShapeOrientation } from '../shape/reverse-shape-orientation.js';
import { mapmap } from '../utils/map-map.js';
import { getJordanTurningNumber } from '../shape/get-jordan-turning-number.js';
import { combineBezierPieces } from './combine-bezier-pieces.js';
import { connectEndpoints } from './connect-endpoints.js';
function postProcess(__loopss, forceOrientationNegative, minLoopArea) {
    const _loopss = __loopss.map(loops => {
        return loops.map(bezierPieces => {
            const bezierPieces_ = combineBezierPieces(bezierPieces);
            const _beziers = bezierPieces_.map(bezierPieceToBezier);
            const beziers = connectEndpoints(_beziers);
            return beziers;
        });
    });
    const loopss = forceOrientationNegative
        ? _loopss.map(_loops => getJordanTurningNumber(_loops[0]) !== -1
            ? _loops.map(reverseShapeOrientation)
            : _loops)
        : _loopss;
    const minAreaFilter = timeFunctionCalls(filterLoopsByMinAllowedArea(minLoopArea));
    const loopss_ = minAreaFilter(loopss)
        .map(loops => loops.toSorted(compareLoopByMinY));
    let loopIdx = 0;
    const loopss__ = mapmap(loopss_, l => loopFromBeziers(l, loopIdx++));
    addDebugInfo2(loopss__); // adds debug info used within __tests__ (and the demo)
    // if (typeof _debug_ !== 'undefined') {
    //     const { l1, l2, l3, lil1, lil2, lil3, lil4 } = _debug_.callCounts;
    // console.log(lil1, lil2, lil3, lil4);
    // console.log(l1,l2,l3);
    // }
    return loopss__;
    // return loopss_;
}
export { postProcess };
//# sourceMappingURL=post-process.js.map