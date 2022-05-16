import { drawFs } from 'flo-draw';
import { IDebugElems } from '../debug-elem-types.js';
import { drawMinY } from './draw-min-y.js';
import { drawLoop } from './draw-loop.js';
import { drawLoops } from './draw-loops.js';
import { drawIntersection } from './draw-intersection.js';
import { drawContainer } from './draw-container.js';
import { drawLooseBoundingBox } from './draw-loose-bounding-box.js';
import { drawTightBoundingBox } from './draw-tight-bounding-box.js';
import { drawBoundingHull } from './draw-bounding-hull.js';
import { drawLoopPre } from './draw-loop-pre.js';
import { drawLoopsPre } from './draw-loops-pre.js';


type TDrawElemFunctions = 
	{ [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T], classes?: string, delay?: number) => SVGElement[] };


const drawElemFunctions: TDrawElemFunctions = {
	minY: drawMinY,
	loop: drawLoop,
	loopPre: drawLoopPre,
	loopsPre: drawLoopsPre,
	loops: drawLoops,
	intersection: drawIntersection,
	container: drawContainer,
	bezier_: drawFs.bezier,
	looseBoundingBox_: drawLooseBoundingBox,
	tightBoundingBox_: drawTightBoundingBox,
	boundingHull_: drawBoundingHull,
}


export { drawElemFunctions, TDrawElemFunctions }
