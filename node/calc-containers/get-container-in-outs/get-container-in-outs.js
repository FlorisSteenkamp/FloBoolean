import { getInOutsViaSides } from "./get-in-outs-via-sides/get-in-outs-via-sides.js";
import { getInOutsViaCrossing } from "./get-in-outs-via-crossing/get-in-outs-via-crossing.js";
/**
 * * **warning** ioIdx will be modified by this function
 *
 * @param container
 * @param ioIdx
 */
function getContainerInOuts(container, ioIdx) {
    // We check one __X__ for each curve with an intersection within this container
    const xs = container.xs;
    // console.log(xs);
    // Check nature of Xs. If Xs is the very common case where two curves cross
    // we can use a faster check. Also in the bit less common case where all
    // curves are joining at an interface we can do a fast ccw (the ccw part
    // has not been implemented yet).
    if (xs.length === 2) {
        if (xs[0].x.kind === 1 && xs[1].x.kind === 1 &&
            xs[0].x.ri.multiplicity % 2 === 1 && xs[1].x.ri.multiplicity % 2 === 1) {
            return getInOutsViaCrossing(container, ioIdx);
        }
    }
    return getInOutsViaSides(container, ioIdx);
}
export { getContainerInOuts };
//# sourceMappingURL=get-container-in-outs.js.map