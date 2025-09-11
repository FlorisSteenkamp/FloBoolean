/**
 * Returns the moment of inertia of the given shape (Ixx and Iyy).
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
declare function getMomentOfInertia(pss: number[][][]): number[];
/**
 * Returns the product moment of inertia `[Ixy, Iyx]` of the given shape.
 *
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
declare function getProdMomentOfInertia(pss: number[][][]): number[];
export { getMomentOfInertia, getProdMomentOfInertia };
