import { getShapeArea$ } from "./get-shape-area.js";
const { sign } = Math;
/**
 * * **precondition**: `shape` **must** be a Jordan curve (simple, closed)
 *
 * * similar to `getTurningNumber` but much faster due to the Jordan curve
 *   constraint / precondition
 */
function getJordanTurningNumber(shape) {
    return sign(getShapeArea$(shape));
}
export { getJordanTurningNumber };
//# sourceMappingURL=get-jordan-turning-number.js.map