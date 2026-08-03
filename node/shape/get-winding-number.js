import { getTotalShapeCurvature } from "./get-total-shape-curvature.js";
const { round, PI: π } = Math;
/**
 * Returns the winding number of the given shape.
 *
 * @param shape
 */
function getWindingNumber(shape) {
    return round(getTotalShapeCurvature(shape) / (2 * π));
}
export { getWindingNumber };
//# sourceMappingURL=get-winding-number.js.map