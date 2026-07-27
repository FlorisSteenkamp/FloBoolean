import { Invariants } from "./invariants.js";
import { Tolerance } from "./tolerance.js";
import { checkInvariant } from './check-invariant.js';


function checkInvariants(
        fileName: string,
        invariantsCalc: Invariants[][], 
        invariantsReq: Invariants[][], 
        tolerance: Tolerance) {

    if (invariantsCalc.length !== invariantsReq.length) {
        invariantsCalc.length;
        invariantsReq.length;
        throw new Error(`loopss lengths differ`);
    }

    // invariantsCalc;//?
    for (let i=0; i<invariantsCalc.length; i++) {
        let invariantCalc = invariantsCalc[i];
        let invariantReq  = invariantsReq[i];
        invariantCalc.length;
        invariantReq.length;

        if (invariantCalc.length !== invariantReq.length) {
            invariantCalc.length;//?
            invariantReq.length;//?
            throw new Error(`${fileName}: A loopset of loopss lengths differ: calculated ${invariantCalc.length}, required ${invariantReq.length}`);
        }

        for (let i=0; i<invariantCalc.length; i++) {
            let _invariantCalc = invariantCalc[i];
            let _invariantReq  = invariantReq[i];

            const r = checkInvariant(_invariantCalc, _invariantReq, tolerance);

            if (!r) {
                // _invariantCalc;//?
                // _invariantReq//?
                throw new Error(
                    `${fileName}: Invariant not within tolerance: calculated ${JSON.stringify(_invariantCalc)}, required ${JSON.stringify(_invariantReq)}`
                );
            }
        }
    }

    return true;
}


export { checkInvariants }
