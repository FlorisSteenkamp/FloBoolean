import { getInterfaceRotation, tangent, totalCurvature } from "flo-bezier3";


/**
 * Returns the total curvature around the shape.
 * 
 * * the returned value will be a multiple of 2𝜋
 * 
 * @param pss 
 */
function getTotalShapeCurvature(
        pss: number[][][]): number {

    const len = pss.length;

    // test the loop
    let total = 0;
    for (let i=0; i<len; i++) {
        const j = (i-1+len)%len 
        const psI = pss[j];
        const psO = pss[i];
        const c = totalCurvature(psO, [0,1]);

        // disconutinuous curvature (turn) at interface between 2 beziers
        const θ = getInterfaceRotation(
            tangent(psI, 1), 
            tangent(psO, 0)
        );

        total += c + θ;
    }

    return total;
}


export { getTotalShapeCurvature }
