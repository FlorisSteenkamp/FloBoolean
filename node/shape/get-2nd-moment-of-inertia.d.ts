/**
 * Returns the 2nd moment of inertia (as a double-doulbe) of the given
 * shape (Ixx and Iyy).
 *
 * * intermediate calculations are done in double-double precision
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function ddGet2ndMomentOfInertia(shape: (number[][])[]): number[][];
/**
 * Returns the 2nd moment of inertia of the given shape (Ixx and Iyy).
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
declare function get2ndMomentOfInertia(pss: number[][][]): number[];
/**
 * Returns the product moment of inertia (as a double-doulbe) `Ixy`
 * (note: `Iyx === Ixy` always) of the given shape.
 *
 * * intermediate calculations are done in double-double precision
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
declare function ddGetProdMomentOfInertia(pss: number[][][]): number[];
/**
 * Returns the product moment of inertia `Ixy`
 * (note: `Iyx === Ixy` always) of the given shape.
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
declare function getProdMomentOfInertia(pss: number[][][]): number;
export { get2ndMomentOfInertia, getProdMomentOfInertia, ddGet2ndMomentOfInertia, ddGetProdMomentOfInertia };
