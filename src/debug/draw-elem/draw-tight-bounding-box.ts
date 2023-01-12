import { drawFs } from 'flo-draw';


/** @internal */
function drawTightBoundingBox(
		g: SVGGElement, 
		box: number[][],
		classes = 'thin5 pinker nofill',
		delay = 0) {

	const $box = drawFs.polygon(g, box, classes, delay);

	return $box;
}


export { drawTightBoundingBox }
