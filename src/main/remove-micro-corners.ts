// import type { Loop } from "../shape/loop.js";
// import type { Container } from "../containers/container.js";
// import { controlPointLinesLength } from "flo-bezier3";
// import { getWindingNumber } from "../shape/get-winding-number.js";
// import { loopFromBeziers } from "../shape/loop-from-beziers.js";
// import { mapmap } from "../utils/map-map.js";

// const { abs, max } = Math;


// function removeAllMicroCorners(
//         loopss_: Loop[][],
//         containers: Container[]) {

//     return mapmap(loopss_, loop => {
//         const { beziers } = loop;
//         const lengthTol = max(
//             ...containers.map(
//                 container => abs(container.box[0][0] - container.box[1][0])
//             ),
//             ...containers.map(
//                 container => abs(container.box[0][1] - container.box[1][1])
//             )
//         );
//         const beziers_ = removeMicroCorners(beziers, lengthTol);
//         return loopFromBeziers(beziers_, loop.idx);
//     });
// }


// function removeMicroCorners(
//         pss: number[][][],
//         lengthTol: number) {

//     getWindingNumber(pss);//?
//     const pss_ = pss
//         .map(ps => ps.map(p => [p[0], p[1]]))  // make a copy
//         .filter(ps => controlPointLinesLength(ps) > lengthTol);  // filter micros
        
//     const len = pss_.length;
//     for (let i=0; i<len; i++) {
//         const psS = pss_[i];
//         const psE = pss_[(i+1)%len];

//         const pE = psS[psS.length - 1];
//         const pS = psE[0];

//         if (pS[0] !== pE[0] || pS[1] !== pE[1]) {
//             pE[0] = pS[0];
//             pE[1] = pS[1];
//         }
//     }

//     return pss_;
// }


// export { removeMicroCorners, removeAllMicroCorners }
