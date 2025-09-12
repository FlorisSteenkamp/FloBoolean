import { toPowerBasis, toPowerBasis_1stDerivative, toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
import { multiply, Horner, integrate, ddHorner, ddMultiply, ddIntegrate } from 'flo-poly';
import { ddAddDd, ddDiffDd } from 'double-double';


/** 
 * Returns the 2nd moment of inertia (as a double-doulbe) of the given
 * shape (Ixx and Iyy).
 * 
 * * intermediate calculations are done in double-double precision
 * 
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function ddGet2ndMomentOfInertia(pss: number[][][]): number[][] {
    let cx = [0,0];
    let cy = [0,0];
    for (const ps of pss) {
        const [x,y] = toPowerBasisDd(ps);
        const [dx,dy] = toPowerBasis_1stDerivativeDd(ps);

        const polyX = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(y, y), x), dy), [0,0]);
        const polyY = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(x, x), y), dx), [0,0]);

        const x_ = ddHorner(polyX, 1);
        const y_ = ddHorner(polyY, 1);

        cx = ddAddDd(cx, x_);
        cy = ddDiffDd(cy, y_);
    }

    return [cx, cy];
}


/** 
 * Returns the 2nd moment of inertia of the given shape (Ixx and Iyy).
 * 
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function get2ndMomentOfInertia(pss: number[][][]): number[] {
    let cx = 0;
    let cy = 0;
    for (const ps of pss) {
        const [x,y] = toPowerBasis(ps);
        const [dx,dy] = toPowerBasis_1stDerivative(ps);

        const polyX = integrate(multiply(multiply(multiply(y, y), x), dy), 0);
        const polyY = integrate(multiply(multiply(multiply(x, x), y), dx), 0);

        const x_ = Horner(polyX, 1);
        const y_ = Horner(polyY, 1);

        cx += x_;
        cy += -y_;
    }

    return [cx, cy];
}


/** 
 * Returns the product moment of inertia (as a double-doulbe) `Ixy`
 * (note: `Iyx === Ixy` always) of the given shape.
 * 
 * * intermediate calculations are done in double-double precision
 * 
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function ddGetProdMomentOfInertia(pss: number[][][]): number[] {
    let cXY = [0,0];
    // let cYX = [0,0];
    for (const ps of pss) {
        const [x,y] = toPowerBasisDd(ps);
        const [dx,dy] = toPowerBasis_1stDerivativeDd(ps);

        const polyXY = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(y, x), x), dy), [0,0]);
        // const polyYX = ddIntegrate(ddMultiply(ddMultiply(ddMultiply(x, y), x), dy), [0,0]);

        const xy = ddHorner(polyXY, 1);
        // const yx = ddHorner(polyYX, 1);

        cXY = ddAddDd(cXY, xy);
        // cYX = ddAddDd(cYX, yx);
    }

    return [cXY[0]/2, cXY[1]/2];
}



/** 
 * Returns the product moment of inertia `Ixy`
 * (note: `Iyx === Ixy` always) of the given shape.
 * 
 * * see e.g. https://en.wikipedia.org/wiki/Second_moment_of_area
 */
function getProdMomentOfInertia(pss: number[][][]): number {
    let cXY = 0;
    // let cYX = 0;
    for (const ps of pss) {
        const [x,y] = toPowerBasis(ps);
        const [dx,dy] = toPowerBasis_1stDerivative(ps);

        const polyXY = integrate(multiply(multiply(multiply(y, x), x), dy), 0);
        // const polyYX = integrate(multiply(multiply(multiply(x, y), x), dy), 0);

        const xy = Horner(polyXY, 1);
        // const yx = Horner(polyYX, 1);

        cXY += xy;
        // cYX += yx;
    }

    // return [cXY/2, cYX/2];
    return cXY/2;
}


export {
    get2ndMomentOfInertia,
    getProdMomentOfInertia,
    ddGet2ndMomentOfInertia,
    ddGetProdMomentOfInertia
}



// Quokka tests

// import { ddToStr } from 'double-double';
// import { dot, rotate } from "flo-vector2d";
// import { degToRad, radToDeg } from '../svg/circle-to-cubic-beziers.js';
// import { getShapeCentroid } from './get-loop-centroid.js';
// import { allRootsCertifiedSimplified } from 'flo-poly';
// import { reverseShapeOrientation } from "./reverse-shape-orientation.js";

// const { PI, atan2, sin, cos } = Math;

// {
//     //----------------
//     // Some rectangle
//     //----------------
//     const pss: number[][][] = reverseShapeOrientation([
//         [[0,0], [0,8]],
//         [[0,8], [1,8]],
//         [[1,8], [1,0]],
//         [[1,0], [0,0]]
//     ]);
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

//     const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);//?
//     const Ixy = getProdMomentOfInertia(pss_);//?
//     const [_Ixx, _Iyy] = ddGet2ndMomentOfInertia(pss_);//?

//     // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
//     const Ixx_ = (1*(8**3))/12;//?
//     const Iyy_ = ((1**3)*8)/12;//?
// }


// {
//     //-------------
//     // Unit circle
//     //-------------
//     const C = 0.5519150244935105707435627

//     const pss = reverseShapeOrientation([
//         [[0,1], [C,1], [1,C], [1,0]],  // quarter circle
//         [[1,0], [1,-C], [C,-1], [0,-1]],
//         [[0,-1], [-C,-1], [-1,-C], [-1,0]],
//         [[-1,0], [-1,C], [-C,1], [0,1]],
//     ]);
    
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

//     const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);//?
//     const Ixy = getProdMomentOfInertia(pss_);//?
    
//     const [_Ixx, _Iyy] = ddGet2ndMomentOfInertia(pss_);//?

//     // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
//     const Ixx_ = PI/4;//?
//     const Iyy_ = PI/4;//?

//     Ixx - Ixx_;//?
//     Iyy - Iyy_;//?
// }

// {
//     //--------------
//     // Some ellipse
//     //--------------
//     const C = 0.5519150244935105707435627;

//     const pss = reverseShapeOrientation([
//         [[0,1], [C/3,1], [1/3,C], [1/3,0]],  // quarter circle
//         [[1/3,0], [1/3,-C], [C/3,-1], [0,-1]],
//         [[0,-1], [-C/3,-1], [-1/3,-C], [-1/3,0]],
//         [[-1/3,0], [-1/3,C], [-C/3,1], [0,1]],
//     ]);
    
//     const c = getShapeCentroid(pss);
//     const _pss = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

//     const θ = 6;
//     const sinθ = sin(degToRad(θ));
//     const cosθ = cos(degToRad(θ));
//     const rot = rotate(sinθ, cosθ);

//     const pss_ = _pss.map(ps => ps.map(rot));

//     const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);//?
//     const [_Ixx, _Iyy] = ddGet2ndMomentOfInertia(pss_);//?
//     const Ixy = getProdMomentOfInertia(pss_);//?
//     const Ixy_ = ddGetProdMomentOfInertia(pss_);//?
    
//     ddToStr(_Ixx);//?
//     ddToStr(_Iyy);//?
//     ddToStr(Ixy_);//?
//     // ddToStr(Iyx_);//?

//     // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
//     const Ixx_ = (PI/4)*(1/3)*(1**3);//?
//     const Iyy_ = (PI/4)*((1/3)**3)*(1);//?

//     Ixx - Ixx_;//?
//     Iyy - Iyy_;//?
// }


// {
//     //--------
//     // Square
//     //--------
//     const pss: number[][][] = reverseShapeOrientation([
//         [[0,0], [0,1]],
//         [[0,1], [1,1]],
//         [[1,1], [1,0]],
//         [[1,0], [0,0]]
//     ]);
//     const c = getShapeCentroid(pss);
//     const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

//     const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);//?
//     const Ixy = getProdMomentOfInertia(pss_);//?

//     const Ixx_ = 1/12;//?
//     const Iyy_ = 1/12;//?
// }
