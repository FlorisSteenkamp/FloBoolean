
import { Invariants } from "./invariants";
import { Tolerance } from "./tolerance";
import { checkInvariant } from './check-invariant';


function checkInvariants(
        invariantsCalc: Invariants[][], 
        invariantsReq: Invariants[][], 
        tolerance: Tolerance) {

    if (invariantsCalc.length !== invariantsReq.length) {
        console.log(`loopss lengths differ`);

        return false;
    }

    for (let i=0; i<invariantsCalc.length; i++) {
        let invariantCalc = invariantsCalc[i];
        let invariantReq  = invariantsReq[i];

        if (invariantCalc.length !== invariantReq.length) {
            console.log(`a loopset of loopss lengths differ`);

            return false;
        }

        for (let i=0; i<invariantCalc.length; i++) {
            let _invariantCalc = invariantCalc[i];
            let _invariantReq  = invariantReq[i];

            if (!checkInvariant(_invariantCalc, _invariantReq, tolerance)) {
                return false;
            }
        }
    }

    return true;
}


export { checkInvariants }
