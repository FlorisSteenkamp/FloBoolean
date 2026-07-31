
/**
 * Returns the result of reversing the orientation of the given shape.
 * 
 * @param shape the shape given as a closed loop of bezier curves
 */
function reverseShapeOrientation(
        shape: number[][][]) {

    return shape.map(ps => ps.toReversed()).toReversed();
}


export { reverseShapeOrientation }
