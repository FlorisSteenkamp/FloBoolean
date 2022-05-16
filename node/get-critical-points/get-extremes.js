import { getExtreme } from "./get-extreme.js";
// TODO - include all interface points close to the extreme - they are the only
// important interface points - or are they??
/**
 *
 * @param loops
 */
function getExtremes(loops) {
    let extremes = new Map();
    let xs = [];
    for (let loop of loops) {
        let xPair = getExtreme(loop);
        xs.push(xPair);
        extremes.set(loop, xPair);
    }
    return { extremes, xs };
}
export { getExtremes };
//# sourceMappingURL=get-extremes.js.map