import { RootInterval } from "flo-poly";


function doRisOverlap(
        riA: RootInterval,
        riB: RootInterval): boolean {

    return (riA.tS <= riB.tE && riB.tS <= riA.tE);
}


export { doRisOverlap }
