
// TODO - a work in progress - currently using a different (less accurate?) 
// function.


/** 
 * @hidden
 * Get an array of corresponding cubic bezier curve parameters for given arc 
 * curve paramters.
 */
function arcToCubicCurves(
        /** the start point */
        pS: number[], 
        /** radius x */
        rx: number,
        /** radius y */
        ry: number, 
        /** x-axis rotation - in degrees */
        rotationAngle: number, 
        largeArcFlag: number, 
        sweepFlag: number,
        pE: number[]): number[][][] {

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
function rotate(
        x: number, 
        y: number, 
        angleRad: number): { x: number, y: number } {

    const X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
    const Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
    return {x: X, y: Y};
}


/**
 * @param degrees 
 */
function degToRad(degrees: number) {
    return (Math.PI * degrees) / 180;
}


export { arcToCubicCurves }
