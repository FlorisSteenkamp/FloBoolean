import type { Loop } from './loop.js';
import { getYBoundsTight } from 'flo-bezier3';
import { memoize } from 'flo-memoize';


/** 
 *
 */
const getMinY = memoize(function(
		loop: Loop) {

	const { curves } = loop;

	let bestY = getYBoundsTight(curves[0].ps).minY;
	let bestCurve = curves[0];

	for (let i=1; i<curves.length; i++) {
		const ps = curves[i].ps;
		const minY = getYBoundsTight(ps).minY;
		
		const v = minY.box[0][1];
		const x = bestY.box[0][1];
		if (v < x || (v === x && minY.ts[0] > bestY.ts[0])) { 
			bestY = minY;
			bestCurve = curves[i];
		}
	}

	return { curve: bestCurve, y: bestY }; 
});


export { getMinY }
