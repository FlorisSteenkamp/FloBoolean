import type { Loop } from "../../shape/loop.js";
import type { _X_ } from "../../get-critical-points/-x-.js";
import { getBezierTurnarounds } from "../../bezier/get-bezier-turnarounds.js";
import { toP } from "../../utils/to-p.js";


function getTurnarounds(
        loops: Loop[]): [_X_][] {

    const turnarounds: [_X_][] = [];
    for (let loop of loops) {
        for (let curve of loop.curves) {
            const { ps } = curve;

            const xPairs = getBezierTurnarounds(ps)
            .map((ri): [_X_] => {
                const { t } = ri;
                const p = toP(ps, t);

                const _x_: _X_ = {
                    curve,
                    x: { p, ri, kind: 8 },
                    next: undefined!,      // will be set later
                    prev: undefined!,      // ...
                    container: undefined!  // ...
                };

                return [_x_];
            });

            turnarounds.push(...xPairs);
        }
    }

    return turnarounds;
}


export { getTurnarounds }
