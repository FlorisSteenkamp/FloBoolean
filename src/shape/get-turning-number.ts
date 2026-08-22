import { getTotalShapeCurvature } from "./get-total-shape-curvature.js";

const { round, PI: π } = Math;


/**
 * Returns the turning number of the given shape.
 * 
 * @param shape 
 */
function getTurningNumber(
        shape: (number[][])[]): number {

    return round(getTotalShapeCurvature(shape)/(2*π));
}


export { getTurningNumber }
