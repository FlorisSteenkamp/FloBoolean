import { controlPointLinesLength } from "flo-bezier3";
import { getWindingNumber } from "../shape/get-winding-number.js";
function removeMicroCorners(pss, lengthTol) {
    getWindingNumber(pss); //?
    const pss_ = pss
        .map(ps => ps.map(p => [p[0], p[1]])) // make a copy
        .filter(ps => controlPointLinesLength(ps) > lengthTol); // filter micros
    const len = pss_.length;
    for (let i = 0; i < len; i++) {
        const psS = pss_[i];
        const psE = pss_[(i + 1) % len];
        const pE = psS[psS.length - 1];
        const pS = psE[0];
        if (pS[0] !== pE[0] || pS[1] !== pE[1]) {
            pE[0] = pS[0];
            pE[1] = pS[1];
        }
    }
    return pss_;
}
export { removeMicroCorners };
//# sourceMappingURL=remove-micro-corners.js.map