import { Container } from "../container.js";
import { __X__ } from "../-x-.js";


function mergeContainers(ccs: Container[][]) {
    let containers: Container[] = [];
    for (let cc of ccs) {
        let minLeft = Number.POSITIVE_INFINITY;
        let minTop = Number.POSITIVE_INFINITY;
        let maxRight = Number.NEGATIVE_INFINITY;
        let maxBottom = Number.NEGATIVE_INFINITY;
        let xs: __X__[] = [];
        for (let c of cc) {
            let [[left,top], [right,bottom]] = c.box;
            if (left   < minLeft  ) { minLeft   = left;   }
            if (top    < minTop   ) { minTop    = top;    }
            if (right  > maxRight ) { maxRight  = right;  }
            if (bottom > maxBottom) { maxBottom = bottom; }
            xs.push(...c.xs);
        }

        // console.log(minLeft)
        let container: Container = {
            box: [[minLeft,minTop], [maxRight,maxBottom]],
            xs: xs,
            inOuts: undefined!
        };

        containers.push(container);
    }

    return containers;
}


export { mergeContainers }
