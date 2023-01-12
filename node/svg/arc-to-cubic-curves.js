// TODO - a work in progress - currently using a different (less accurate?) 
// function.
/**
 * @hidden
 * Get an array of corresponding cubic bezier curve parameters for given arc
 * curve paramters.
 */
function arcToCubicCurves(
/** the start point */
pS, 
/** radius x */
rx, 
/** radius y */
ry, 
/** x-axis rotation - in degrees */
rotationAngle, largeArcFlag, sweepFlag, pE) {
    return [[
            pS,
            pE
        ]];
}
/**
 * @param x
 * @param y
 * @param angleRad
 */
function rotate(x, y, angleRad) {
    const X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
    const Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
    return { x: X, y: Y };
}
/**
 * @param degrees
 */
function degToRad(degrees) {
    return (Math.PI * degrees) / 180;
}
export { arcToCubicCurves };
//# sourceMappingURL=arc-to-cubic-curves.js.map