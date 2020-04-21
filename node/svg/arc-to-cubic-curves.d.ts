/**
 * @hidden
 * Get an array of corresponding cubic bezier curve parameters for given arc
 * curve paramters.
 */
declare function arcToCubicCurves(
/** the start point */
pS: number[], 
/** radius x */
rx: number, 
/** radius y */
ry: number, 
/** x-axis rotation - in degrees */
rotationAngle: number, largeArcFlag: number, sweepFlag: number, pE: number[]): number[][][];
export { arcToCubicCurves };
