import type { Container } from "../../container.js";
import type { __X__ } from "../../../get-critical-points/-x-.js";


function mergeContainers(ccs: Container[][]) {
    const containers: Container[] = [];

    for (const cc of ccs) {
        let minLeft = Number.POSITIVE_INFINITY;
        let minTop = Number.POSITIVE_INFINITY;
        let maxRight = Number.NEGATIVE_INFINITY;
        let maxBottom = Number.NEGATIVE_INFINITY;
        const xs: __X__[] = [];
        for (const c of cc) {
            const [[left,top], [right,bottom]] = c.box;
            if (left   < minLeft  ) { minLeft   = left;   }
            if (top    < minTop   ) { minTop    = top;    }
            if (right  > maxRight ) { maxRight  = right;  }
            if (bottom > maxBottom) { maxBottom = bottom; }
            xs.push(...c.xs);
        }

        const container: Container = {
            box: [[minLeft,minTop], [maxRight,maxBottom]],
            xs,
            inOuts: undefined!
        };

        containers.push(container);
    }

    return containers;
}


export { mergeContainers }
