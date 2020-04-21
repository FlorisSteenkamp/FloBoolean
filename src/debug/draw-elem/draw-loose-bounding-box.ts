
import { drawFs } from "flo-draw";


/** @hidden */
function drawLooseBoundingBox(
		g: SVGGElement, 
		box: number[][],
		classes = 'thin5 brown nofill',
		delay = 0) {

	let [[x0, y0],[x1, y1]] = box;
	box = [[x0, y0],[x1, y0],[x1,y1],[x0,y1]];

	let $box = drawFs.polygon(g, box, classes, delay);
	
	return $box;
}


export { drawLooseBoundingBox }
