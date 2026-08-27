declare const _debug_: Debug; 
import type { Debug } from '../../../src/debug/debug.js';
import type { StateControl } from '../state-control/state-control.js';
import type { ToDraw } from '../state/to-draw.js';
import { deleteSvgs } from './delete-svgs.js';
import { drawIntersection } from '../../../src/debug/draw-elem/draw-intersection.js';
import { drawLoopPre } from '../../../src/debug/draw-elem/draw-loop-pre.js';
import { drawLoopsPre } from '../../../src/debug/draw-elem/draw-loops-pre.js';
import { drawContainer } from '../../../src/debug/draw-elem/draw-container.js';
import { drawMinY } from '../../../src/debug/draw-elem/draw-min-y.js';
import { drawFs } from 'flo-draw';
import { drawLooseBoundingBox } from '../../../src/debug/draw-elem/draw-loose-bounding-box.js';
import { drawTightBoundingBox } from '../../../src/debug/draw-elem/draw-tight-bounding-box.js';
import { drawBoundingHull } from '../../../src/debug/draw-elem/draw-bounding-hull.js';
import { drawLoop } from '../../../src/debug/draw-elem/draw-loop.js';
import { drawLoops } from '../../../src/debug/draw-elem/draw-loops.js';


async function drawElements(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>,
        toDraws: ToDraw) {

    if (typeof _debug_ === 'undefined') { return; }

    const { transientState } = stateControl;
    const { $svgs } = transientState;

    const svg$ = ref.current!;
    const g = svg$.getElementsByTagName('g')[0];

    deleteSvgs($svgs.loopPre);
    deleteSvgs($svgs.loopsPre);
    deleteSvgs($svgs.loops);
    deleteSvgs($svgs.minY);
    deleteSvgs($svgs.bezier_);
    deleteSvgs($svgs.looseBoundingBox_);
    deleteSvgs($svgs.tightBoundingBox_);
    deleteSvgs($svgs.boundingHull_);
    deleteSvgs($svgs.loop);
    deleteSvgs($svgs.intersection);
    deleteSvgs($svgs.container);
    
    const {
        loopPre, loopsPre, loops, minY, bezier_, looseBoundingBox_,
        tightBoundingBox_, boundingHull_, loop, intersection, container 
    } = _debug_.elems;

    toDraws.loopPre && $svgs.loopPre.push(...loopPre.map(elem => drawLoopPre(g, elem)));
    toDraws.loopsPre && $svgs.loopsPre.push(...loopsPre.map(elem => drawLoopsPre(g, elem)));
    toDraws.loops && $svgs.loops.push(...loops.map(elem => drawLoops(g, elem)));
    toDraws.minY && $svgs.minY.push(...minY.map(elem => drawMinY(g, elem)));
    toDraws.bezier_ && $svgs.bezier_.push(...bezier_.map(elem => drawFs.bezier(g, elem)));
    toDraws.looseBoundingBox_ && $svgs.looseBoundingBox_.push(...looseBoundingBox_.map(elem => drawLooseBoundingBox(g, elem)));
    toDraws.tightBoundingBox_ && $svgs.tightBoundingBox_.push(...tightBoundingBox_.map(elem => drawTightBoundingBox(g, elem)));
    toDraws.boundingHull_ && $svgs.boundingHull_.push(...boundingHull_.map(elem => drawBoundingHull(g, elem)));
    toDraws.loop && $svgs.loop.push(...loop.map(elem => drawLoop(g, elem)));
    toDraws.intersection && $svgs.intersection.push(...intersection.map(elem => drawIntersection(g, elem)));
    toDraws.container && $svgs.container.push(...container.map(elem => drawContainer(g, elem)));
}


export { drawElements }
