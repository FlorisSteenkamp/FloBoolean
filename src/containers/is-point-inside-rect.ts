
/**
 * Returns `true` if the given point is within the given axis-aligned rect.
 * 
 * @param closed set to `true` if the rectangle's edges should be taken into
 * account, `false` otherwise
 * @param rect given as `{ minX, minY, maxX, maxY }`
 * @param p 
 */
function isPointInsideRect(
        closed: boolean,
        rect: { minX: number, minY: number, maxX: number, maxY: number },
        p: number[]) {

    const { minX, minY, maxX, maxY } = rect;
    const [x,y] = p;

    return closed
        ? (x >= minX && x <= maxX && y >= minY && y <= maxY)
        : (x > minX && x < maxX && y > minY && y < maxY);
}


export { isPointInsideRect }
