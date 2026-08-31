import { ddCompare } from "double-double";
function ddDoRisOverlap(riA, riB) {
    return ddCompare(riA.tS, riB.tE) <= 0 &&
        ddCompare(riB.tS, riA.tE) <= 0;
}
export { ddDoRisOverlap };
//# sourceMappingURL=dd-do-ris-overlap.js.map