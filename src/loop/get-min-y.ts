
import { getYBoundsTight } from 'flo-bezier3';
import { memoize } from 'flo-memoize';
import { Loop } from './loop';


/** 
 *
 */
let getMinY = memoize(function getMinY(loop: Loop)/*: number[][]*/ {
	let curves = loop.curves;

	let bestY = getYBoundsTight(curves[0].ps).minY;
	let bestCurve = curves[0];
	

	for (let i=1; i<curves.length; i++) {
		let ps = loop.curves[i].ps;
		let minY = getYBoundsTight(ps).minY;
		
		let v = minY.box[0][1];
		let x = bestY.box[0][1];
		if (v < x || (v === x && minY.ts[0] > bestY.ts[0])) { 
			bestY = minY;
			bestCurve = loop.curves[i];
		}
	}

	return { curve: bestCurve, y: bestY }; 
});


export { getMinY }
