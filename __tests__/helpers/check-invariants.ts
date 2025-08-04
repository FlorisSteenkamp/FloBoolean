import { Invariants } from "./invariants";
import { Tolerance } from "./tolerance";
import { checkInvariant } from './check-invariant';


function checkInvariants(
        invariantsCalc: Invariants[][], 
        invariantsReq: Invariants[][], 
        tolerance: Tolerance) {

    // invariantsCalc.length;//?
    // invariantsReq.length;//?
    if (invariantsCalc.length !== invariantsReq.length) {
        throw new Error(`loopss lengths differ`);
    }
    // invariantsCalc.map(v => v.length);//?
    // invariantsReq.map(v => v.length);//?
    // invariantsCalc[0];//?

    for (let i=0; i<invariantsCalc.length; i++) {
        let invariantCalc = invariantsCalc[i];
        let invariantReq  = invariantsReq[i];
        invariantCalc.length;//?
        invariantReq.length;//?

        if (invariantCalc.length !== invariantReq.length) {
            throw new Error(`a loopset of loopss lengths differ`);
        }

        for (let i=0; i<invariantCalc.length; i++) {
            let _invariantCalc = invariantCalc[i];
            let _invariantReq  = invariantReq[i];

            const r = checkInvariant(_invariantCalc, _invariantReq, tolerance);

            if (!r) {
                // _invariantCalc;//?
                // _invariantReq//?
                throw new Error(`Invariant not within tolerance: calculated ${_invariantCalc}, required ${_invariantReq}`);
            }
        }
    }

    return true;
}


export { checkInvariants }
