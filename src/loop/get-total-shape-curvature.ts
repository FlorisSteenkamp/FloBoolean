import { getInterfaceRotation, tangent, totalCurvature } from "flo-bezier3";
import { reverseShapeOrientation } from "./reverse-shape-orientation";

const { PI } = Math;


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

        // (Math.PI - (c+d)) / (2*Math.PI) * 360;

        // @ts-ignore - otherwise TypeScript gives an error on nearly
        // expect(c).to.be.nearly(2**32,d)

        // disconutinuous curvature (turn) at interface between 2 beziers
        const θ = getInterfaceRotation(
            tangent(psI, 1), 
            tangent(psO, 0)
        );

        total += c + θ;
    }

    // const totalWinding = total / (2*PI);

    // return totalWinding;
    return total;

    // @ts-ignore - otherwise TypeScript gives an error on nearly
    // expect(totalWinding - Math.round(totalWinding)).to.be.nearly([2**8],0);
}


export { getTotalShapeCurvature }


// Quokka tests
// {
//     //----------------
//     // Some rectangle
//     //----------------
//     const pss = [
//         [[0,0], [0,8]],
//         [[0,8], [1,8]],
//         [[1,8], [1,0]],
//         [[1,0], [0,0]]
//     ];
//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }


// {
//     //-------------
//     // Unit circle
//     //-------------
//     const C = 0.5519150244935105707435627

//     const pss = ([
//         [[0,1], [C,1], [1,C], [1,0]],  // quarter circle
//         [[1,0], [1,-C], [C,-1], [0,-1]],
//         [[0,-1], [-C,-1], [-1,-C], [-1,0]],
//         [[-1,0], [-1,C], [-C,1], [0,1]],
//     ]);
    
//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }

// {
//     //--------------
//     // Some ellipse
//     //--------------
//     const C = 0.5519150244935105707435627

//     const pss = ([
//         [[0,1], [C/3,1], [1/3,C], [1/3,0]],  // quarter circle
//         [[1/3,0], [1/3,-C], [C/3,-1], [0,-1]],
//         [[0,-1], [-C/3,-1], [-1/3,-C], [-1/3,0]],
//         [[-1/3,0], [-1/3,C], [-C/3,1], [0,1]],
//     ]);
    
//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }

// {
//     //--------
//     // Square
//     //--------
//     const pss: number[][][] = ([
//         [[0,0], [0,1]],
//         [[0,1], [1,1]],
//         [[1,1], [1,0]],
//         [[1,0], [0,0]]
//     ]);

//     const pss_ = reverseShapeOrientation(pss);
//     const k = getTotalShapeCurvature(pss);
//     const k_ = getTotalShapeCurvature(pss_);

//     k/(2*PI);//?
//     k_/(2*PI);//?
// }