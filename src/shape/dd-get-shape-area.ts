import { ddAddDd, twoProduct, ddDiffDd, ddMultBy2, ddDivDouble, doubleDivDouble, ddMultDd, ddDivBy2 } from "double-double";


const tp = twoProduct;
const qaq = ddAddDd;
const qdq = ddDiffDd;
const qm2 = ddMultBy2;
const qmq = ddMultDd;

const _3_10 = doubleDivDouble(3,10);


/** 
 * Returns the signed winding number weighted area of the given shape.
 * 
 * * also useful for finding the orientation of loops
 * 
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 * 
 * @param shape the shape given as a closed loop of bezier curves
 */
function ddGetShapeArea(
        shape: number[][][]): number[] {

    let twiceArea = [0,0];
    for (const ps of shape) {
        // weights are ∫₀¹ (Bᵢ Bⱼ' − Bᵢ' Bⱼ) dt over the Bernstein basis
        switch (ps.length) {
            case 2:  // line
                twiceArea = qaq(twiceArea, ddCross(ps, 0, 1));
                break;
            case 3:  // quadratic
                const a = qm2(ddCross(ps, 0, 1));
                const b = ddCross(ps, 0, 2);
                const c = qm2(ddCross(ps, 1, 2));

                const abc_3 = ddDivDouble(qaq(qaq(a,b),c),3);

                twiceArea = qaq(twiceArea, abc_3);
                break;
            case 4:  // cubic
                const d2 = qm2(ddCross(ps, 0, 1));
                const e = ddCross(ps, 0, 2);
                const f_3 = ddDivDouble(ddCross(ps, 0, 3),3);
                const g = ddCross(ps, 1, 2);
                const h = ddCross(ps, 1, 3);
                const k2 = qm2(ddCross(ps, 2, 3));

                const l = qmq(qaq(qaq(qaq(d2,e),qaq(f_3,g)), qaq(h,k2)),_3_10);

                twiceArea = qaq(twiceArea, l);

                break;
        }
    }

    return ddDivBy2(twiceArea);
}


// `x_i·y_j - x_j·y_i` for control points `i`,`j` of a piece
function ddCross(
        ps: number[][],
        i: number,
        j: number) {

    return qdq(tp(ps[i][0], ps[j][1]), tp(ps[j][0], ps[i][1]));
}


export { ddGetShapeArea }



// import { toPowerBasis_1stDerivativeDd, toPowerBasisDd } from "flo-bezier3";
// import { ddMultiply, ddNegate, ddIntegrate, ddAdd, ddHorner } from 'flo-poly';
/** 
 * THIS FUNCTION WAS REPLACED BY A MORE ACCURATE ONE
 * 
 * Returns the area of the given shape.
 * 
 * * see e.g. https://mathinsight.org/greens_theorem_find_area
 * 
 * @param shape the shape given as a closed loop of bezier curves
 */
// function ddGetShapeArea(
//         shape: (number[][])[]) {

//     let totalArea = [0,0];
//     for (const ps of shape) {
//         const [x,y] = toPowerBasisDd(ps);
//         const [dx,dy] = toPowerBasis_1stDerivativeDd(ps);

//         const xdy = ddMultiply(x, dy);
//         const ydx = ddNegate(ddMultiply(y, dx));

//         const poly = ddIntegrate(ddAdd(xdy, ydx), [0,0]);
//         const area = ddHorner(poly, 1);

//         totalArea = ddAddDd(totalArea, area);
//     }

//     return [totalArea[0]/2, totalArea[1]/2];
// }