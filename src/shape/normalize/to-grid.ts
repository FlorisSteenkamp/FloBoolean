import { reduceSignificand } from "big-float-ts";

const { floor, log2, abs } = Math;


/**
 * Sends `a` onto a fixed-spacing grid with `2**significantBits` divisions.
 * Each division is `2**(maxExp - significantBits)` wide.
 * 
 * @param a 
 * @param expMax log2(max extent of grid in positive and negative directions)
 * 
 * @param significantBits
 */
function toGrid(
        expMax: number,
        significantBits: number) {

    return function(a: number): number {
        const expA = floor(log2(abs(a)));

        const newSig = significantBits - expMax + expA + 1;
        
        if (newSig <= 0) { return 0; }
        if (significantBits >= 53) { return a; }

        return reduceSignificand(a, newSig);
    }
}


export { toGrid }
