import { reduceSignificand } from "big-float-ts";


/**
 * Sends a onto a fixed-spacing grid with 2**significantFigures divisions. Each
 * division is 2**maxExp / 2**significantFigures wide.
 * @param a 
 * @param expMax log2(max extent of grid in positive and negative directions)
 * 
 * @param significantFigures
 */
function toGrid(
        a: number, 
        expMax: number,
        significantFigures: number): number {

    let expA = Math.floor(Math.log2(Math.abs(a)));
    let expDif = expMax - expA;
    let newSig = significantFigures - expDif + 1;
    
    if (newSig <= 0) { return 0; }
    if (significantFigures >= 53) { return a; }

    return reduceSignificand(a, newSig);
}


export { toGrid }
