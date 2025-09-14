import { getBounds_ } from '../get-bounds-.js';
function getShapeBounds(pss) {
    const bounds = pss.map(getBounds_);
    return {
        minX: Math.min(...bounds.map(bound => bound.box[0][0])),
        maxX: Math.max(...bounds.map(bound => bound.box[1][0])),
        minY: Math.min(...bounds.map(bound => bound.box[0][1])),
        maxY: Math.max(...bounds.map(bound => bound.box[1][1])),
    };
}
export { getShapeBounds };
//# sourceMappingURL=get-shape-bounds.js.map