import type { Container } from "../../container.js";
import type { _X_ } from "../../../get-critical-points/-x-.js";

const { min, max } = Math;


function mergeContainers(
        containers: Container[]): Container {

    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;
    const xs: _X_[] = [];

    for (const container of containers) {
        const [[left,top], [right,bottom]] = container.box;

        minLeft   = min(minLeft,   left);
        minTop    = min(minTop,    top);
        maxRight  = max(maxRight,  right);
        maxBottom = max(maxBottom, bottom);

        xs.push(...container.xs);
    }

    return {
        box: [[minLeft,minTop], [maxRight,maxBottom]],
        bigBox: undefined!,  // will be set later
        xs,
        inOuts: undefined!
    };
}


export { mergeContainers }
