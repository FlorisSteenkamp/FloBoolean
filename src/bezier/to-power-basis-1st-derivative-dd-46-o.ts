
/**
 * Returns the derivative of the power basis representation of a bezier 
 * curve of order cubic or less (with intermediate calculations done in 
 * double-double precision).
 * 
 * * modified to take advantage of coordinates being guaranteed to be 46-bit aligned
 * * Returned coefficients are divided by 3 for cubics and 2 for quadratics
 * 
 * * returns the resulting power basis x and y coordinate polynomials from 
 * highest power to lowest, e.g. if `x(t) = at^2 + bt + c` 
 * and `y(t) = dt^2 + et + f` then  the result is returned 
 * as `[[a,b,c],[d,e,f]]`, where the `a,b,c,...` are in double-double precision
 * 
 * @param ps an order 0,1,2 or 3 bezier curve given by an ordered array of its
 * control points, e.g. `[[0,0],[1,1],[2,1],[2,0]]`
 * 
 * @doc
 */
 function toPowerBasis_1stDerivative_46_O(ps: number[][]): number[][] {
    if (ps.length === 4) {
        return toPowerBasis3_1stDerivative_46_O3(ps);
    }

    if (ps.length === 3) {
        return toPowerBasis2_1stDerivative_46_O2(ps);
    }

    return toPowerBasis1_1stDerivative_46(ps);
}


/** @internal */
function toPowerBasis3_1stDerivative_46_O3(ps: number[][]): number[][] {
    const [[x0,y0], [x1,y1], [x2,y2], [x3,y3]] = ps;

    return [[
        // (3*((x3 - x0) + 3*(x1 - x2))) / 3,
        (x3 - x0) + 3*(x1 - x2),
        // (6*((x2 + x0) - 2*x1)) / 3,
        2*(x2 + x0 -2*x1),
        // (3*(x1 - x0)) / 3
        x1 - x0
    ], [
        // (3*((y3 - y0) + 3*(y1 - y2))) / 3,
        (y3 - y0) + 3*(y1 - y2),
        // (6*((y2 + y0) - 2*y1)) / 3,
        2*(y2 + y0 -2*y1),
        // (3*(y1 - y0)) / 3
        y1 - y0
    ]];
}


/** @internal */
function toPowerBasis2_1stDerivative_46_O2(ps: number[][]): number[][] {
    const [[x0,y0], [x1,y1], [x2,y2]] = ps;
    return [[
        // (2*((x2 + x0) - 2*x1)) / 2
        x2 + x0 - 2*x1,
        // (2*(x1 - x0)) / 2
        x1 - x0,
    ], [
        // (2*((y2 + y0) - 2*y1)) / 2
        y2 + y0 - 2*y1,
        // (2*(y1 - y0)) / 2
        y1 - y0,
    ]];
} 
    

/** @internal */
function toPowerBasis1_1stDerivative_46(ps: number[][]): number[][] {
    const [[x0,y0], [x1,y1]] = ps;

    return [[x1 - x0], [y1 - y0]];
}


export { toPowerBasis_1stDerivative_46_O }
