import type { Loop } from "../../shape/loop.js";
import type { X } from "../../get-critical-points/x.js";
import { getBezierTurnarounds } from "../../bezier/get-bezier-turnarounds.js";
import { toP } from "../../utils/to-p.js";


function getTurnarounds(
        loops: Loop[]): [X][] {

    const turnarounds: [X][] = [];
    for (let loop of loops) {
        for (let curve of loop.curves) {
            const { ps } = curve;

            const xPairs = getBezierTurnarounds(ps)
            .map((ri): [X] => {
                const { t } = ri;
                const p = toP(ps, t);

                // `next`, `prev`, `container` will be set later
                const x: X = { p, ri, kind: 8, curve };

                return [x];
            });

            turnarounds.push(...xPairs);
        }
    }

    return turnarounds;
}


export { getTurnarounds }
