import { getXInOuts } from "./get-x-in-outs.js";
import { compareOrderedInOut } from "./compare-in-out.js";
/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container
 * using an extremely small rectangle around the intersections.
 * * **warning** ioIdx will be modified by this function
 * @param container
 * @param ioIdx
 */
function getInOutsViaSides(container, ioIdx) {
    // We check one __X__ for each curve with an intersection within this container
    let xs_ = container.xs;
    //console.log(container.xs);
    let inOuts = [];
    // get a map from each Curve to each __X__ of this container
    let xMap = new Map();
    for (let x of xs_) {
        let curve = x.curve;
        let xs = xMap.get(curve);
        if (!xs) {
            xMap.set(curve, [x]);
        }
        else {
            xs.push(x);
        }
    }
    let getXInOuts_ = getXInOuts(container);
    for (let entry of xMap) {
        let [curve, xs] = entry;
        let ins;
        let outs;
        ({ ins, outs, ioIdx } = getXInOuts_(curve, xs, ioIdx));
        inOuts.push(...ins);
        inOuts.push(...outs);
    }
    inOuts.sort(compareOrderedInOut);
    return { inOuts: inOuts.map(inOut => inOut.inOut), ioIdx };
}
export { getInOutsViaSides };
//# sourceMappingURL=get-in-outs-via-sides.js.map