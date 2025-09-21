import type { InOut } from "../in-out";
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { reverseShapeOrientation } from "../loop/reverse-shape-orientation";


/**
 * 
 * @param out 
 * @param orientation 
 * @param idx identifies the loop during debugging
 */
function loopFromOut(
        out: InOut,
        orientation: number,
        idx: number) {

    const _beziers = out.beziers;
    if (_beziers === undefined) { return loopFromBeziers([], idx)}
    // console.log(orientation);

    const beziers = orientation < 0
        ? _beziers
        : reverseShapeOrientation(_beziers);

    const loop = loopFromBeziers(beziers, idx)

    return loop;
}


export { loopFromOut }
