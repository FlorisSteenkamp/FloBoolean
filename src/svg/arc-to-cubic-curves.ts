
// TODO - a work in progress - currently using a different (less accurate?) 
// function.

const { sin, cos, PI } = Math;


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

    const X = x * cos(angleRad) - y * sin(angleRad);
    const Y = x * sin(angleRad) + y * cos(angleRad);
    return {x: X, y: Y};
}


/**
 * @param degrees 
 */
function degToRad(degrees: number) {
    return (PI * degrees) / 180;
}


export { arcToCubicCurves }
