import type { InOut } from "../containers/in-out/in-out";
import { loopFromBeziers } from '../loop/loop-from-beziers.js';
import { reverseShapeOrientation } from "../loop/reverse-shape-orientation";


/**
 * 
 * @param out 
 * @param orientation 
 * @param loopIdx identifies the loop during debugging
 */
function loopFromOut(
        out: InOut,
        orientation: number,
        loopIdx: number) {

    const _beziers = out.beziers;
    if (_beziers === undefined) { return loopFromBeziers([], loopIdx)}
    // console.log(orientation);

    const beziers = orientation < 0
        ? reverseShapeOrientation(_beziers)
        : _beziers;

    const loop = loopFromBeziers(beziers, loopIdx)

    return loop;
}


export { loopFromOut }
