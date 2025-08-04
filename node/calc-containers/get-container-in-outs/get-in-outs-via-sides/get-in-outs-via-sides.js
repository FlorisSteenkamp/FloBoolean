import { getXInOuts } from "./get-x-in-outs.js";
/**
 * Returns the incoming / outgoing curves (as InOuts) for the given container
 * using an extremely small rectangle around the intersections.
 * * **warning** ioIdx will be modified by this function
 * @param container
 * @param ioIdx
 */
function getInOutsViaSides(container, ioIdx) {
    // We check one __X__ for each curve with an intersection within this container
    const xs_ = container.xs;
    //if (xs_.length === 4) {
    //    console.log(xs_.map(x => x.x.kind))
    //}
    const inOuts = [];
    // get a map from each Curve to each __X__ of this container
    const xMap = new Map();
    for (const x of xs_) {
        const curve = x.curve;
        const xs = xMap.get(curve);
        if (!xs) {
            xMap.set(curve, [x]);
        }
        else {
            xs.push(x);
        }
    }
    const getXInOuts_ = getXInOuts(container);
    for (const entry of xMap) {
        const [curve, xs] = entry;
        let ins;
        let outs;
        ({ ins, outs, ioIdx } = getXInOuts_(curve, xs, ioIdx));
        inOuts.push(...ins);
        inOuts.push(...outs);
    }
    return { inOuts: inOuts, ioIdx };
}
export { getInOutsViaSides };
//# sourceMappingURL=get-in-outs-via-sides.js.map