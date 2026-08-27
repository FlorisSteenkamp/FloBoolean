import { ddCompare } from "double-double";
import { RootIntervalExp } from "flo-poly";


function ddDoRisOverlap(
        riA: RootIntervalExp,
        riB: RootIntervalExp): boolean {

    return ddCompare(riA.tS, riB.tE) <= 0 &&
        ddCompare(riB.tS, riA.tE) <= 0;
}


export { ddDoRisOverlap }
