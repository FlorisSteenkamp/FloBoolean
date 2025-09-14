import { getBounds_ } from '../get-bounds-.js';

const { min, max } = Math;


function getShapeBounds(
        pss: number[][][]): {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        } {

    const bounds = pss.map(getBounds_);

    return {
		minX: min(...bounds.map(bound => bound.box[0][0])),
        maxX: max(...bounds.map(bound => bound.box[1][0])),
        minY: min(...bounds.map(bound => bound.box[0][1])),
		maxY: max(...bounds.map(bound => bound.box[1][1])),
	};
}


export { getShapeBounds }
