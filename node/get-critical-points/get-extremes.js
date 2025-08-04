import { getExtreme } from "./get-extreme";
// TODO - include all interface points close to the extreme - they are the only
// important interface points - or are they??
/**
 *
 * @param loops
 */
function getExtremes(loops) {
    const extremes = new Map();
    const xs = [];
    for (const loop of loops) {
        const xPair = getExtreme(loop);
        xs.push(xPair);
        extremes.set(loop, xPair);
    }
    return { extremes, xs };
}
export { getExtremes };
//# sourceMappingURL=get-extremes.js.map