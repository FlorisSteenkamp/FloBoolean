import { drawFs } from 'flo-draw';


/** @hidden */
function drawTightBoundingBox(
		g: SVGGElement, 
		box: number[][],
		classes = 'thin5 pinker nofill',
		delay = 0) {

	let $box = drawFs.polygon(g, box, classes, delay);

	return $box;
}


export { drawTightBoundingBox }
