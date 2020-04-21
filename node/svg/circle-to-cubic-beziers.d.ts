/**
 *
 * @param center
 * @param radiusX
 * @param radiusY
 * @param rotation in degrees
 * @param clockwise
 */
declare function circleToCubicBeziers(center: number[], radiusX: number, radiusY: number, rotation: number, clockwise?: boolean): number[][][];
export { circleToCubicBeziers };
