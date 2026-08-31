/**
 * Returns the signed winding number weighted area of the given shape.
 *
 * * also useful for finding the orientation of loops
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
declare function ddGetShapeArea(shape: number[][][]): number[];
export { ddGetShapeArea };
/**
 * THIS FUNCTION WAS REPLACED BY A MORE ACCURATE ONE
 *
 * Returns the area of the given shape.
 *
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 *
 * @param shape the shape given as a closed loop of bezier curves
 */
