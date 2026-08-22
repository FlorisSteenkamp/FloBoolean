import { Invariants } from "./invariants.js";
import { Tolerance } from "./tolerance.js";
import { checkInvariant } from './check-invariant.js';


function checkInvariants(
        filename: string,
        invariantsCalc: Invariants[][],
        invariantsReq: Invariants[][],
        tolerance: Tolerance) {

    if (invariantsCalc.length !== invariantsReq.length) {
        invariantsCalc.length;
        invariantsReq.length;
        throw new Error(`${filename}: loopss lengths differ`);
    }

    for (let i=0; i<invariantsCalc.length; i++) {
        const invariantCalc = invariantsCalc[i];
        const invariantReq  = invariantsReq[i];

        if (invariantCalc.length !== invariantReq.length) {
            throw new Error(`${filename}: A loopset of loopss lengths differ: calculated ${invariantCalc.length}, required ${invariantReq.length}`);
        }

        for (let i=0; i<invariantCalc.length; i++) {
            const _invariantCalc = invariantCalc[i];
            const _invariantReq  = invariantReq[i];

            const r = checkInvariant(filename, _invariantCalc, _invariantReq, tolerance);

            if (!r) {
                throw new Error(
                    `${filename}: Invariant not within tolerance: calculated ${JSON.stringify(_invariantCalc)}, required ${JSON.stringify(_invariantReq)}`
                );
            }
        }
    }

    return true;
}


export { checkInvariants }
