declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
import type { BezierPiece } from 'flo-bezier3';
import { splitLoopTrees } from '../../calc-paths/split-loop-trees.js';
import { getLoopsFromTree } from '../../calc-paths/get-loops-from-tree.js';
import { rewireContainers } from './rewire-containers.js';
import { loopssFromOutsets } from '../loopss-from-outsets.js';
import { completePaths } from '../../calc-paths/complete-paths/complete-paths.js';
import { OutSetInfo } from '../out-set.js';


/**
 * Rerun the paths after reversing `InOut`s whose orientation has been reversed.
 * 
 * * creates cleaner (minimal) paths and ensures none of the output loops
 *   overlap which can happen when some bezier curves exactly overlaps
 * 
 * * **modifies** `cotainers` and `InOut`s in-place instead of creating new
 *   ones
 * 
 * @param expMax 
 * @param outSets 
 * @param containers 
 * @param _loopss 
 */
function rerun(
        expMax: number,
        outSets: OutSetInfo[][],
        containers: Container[],
        _loopss: BezierPiece[][][]) {

    const { containers_, minYContainers } = rewireContainers(containers, outSets, _loopss);

    if (typeof _debug_ !== 'undefined') { _debug_.elems.container.length = 0; _debug_.elems.container.push(...containers_.filter(c => c !== undefined)); }

    //--------------------------------------------------------------------------
    // Do the actual run on the new containers using OR
    //--------------------------------------------------------------------------
    const root = completePaths(expMax, minYContainers);

    const outs = splitLoopTrees(root);

    const outSets_ = outs
        .map(getLoopsFromTree('OR'))
        .filter(v => v.length !== 0);

    // the paths taken after the rerun
    // map(outSets_, outSet => map(outSet, ({ out, depth }) => {
    //     console.log('POST: d=' + depth + ' ' + pathToStr(out.path))
    // }));

    return loopssFromOutsets(outSets_);
}


export { rerun }
