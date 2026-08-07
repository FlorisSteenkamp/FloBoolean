
/**
 * Returns `true` if the given point is within the given axis-aligned rect.
 * 
 * @param closed set to `true` if the rectangle's edges should be taken into
 * account, `false` otherwise
 * @param rect given as `[[xMin,yMin],[xMax,yMax]]`
 * @param p 
 */
function isPointInsideRect(
        closed: boolean,
        rect: number[][],
        p: number[]) {

    const [[xMin,yMin],[xMax,yMax]] = rect;
    const [x,y] = p;

    return closed
        ? (x >= xMin && x <= xMax && y >= yMin && y <= yMax)
        : (x > xMin && x < xMax && y > yMin && y < yMax);
}


export { isPointInsideRect }
