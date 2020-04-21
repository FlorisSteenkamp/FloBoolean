
import { IDebugElems } from '../debug-elem-types';
import { drawMinY } from './draw-min-y';
import { drawLoop } from './draw-loop';
import { drawLoops } from './draw-loops';
import { drawIntersection } from './draw-intersection';
import { drawContainer } from './draw-container';
import { drawLooseBoundingBox } from './draw-loose-bounding-box';
import { drawTightBoundingBox } from './draw-tight-bounding-box';
import { drawBoundingHull } from './draw-bounding-hull';
import { drawFs } from 'flo-draw';


type TDrawElemFunctions = 
	{ [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T], classes?: string, delay?: number) => SVGElement[] };


let drawElemFunctions: TDrawElemFunctions = {
	minY: drawMinY,
	loop: drawLoop,
	loops: drawLoops,
	intersection: drawIntersection,
	container: drawContainer,
	bezier_: drawFs.bezier,
	looseBoundingBox_: drawLooseBoundingBox,
	tightBoundingBox_: drawTightBoundingBox,
	boundingHull_: drawBoundingHull
}


export { drawElemFunctions, TDrawElemFunctions }
