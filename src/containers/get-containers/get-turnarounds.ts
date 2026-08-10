import type { Loop } from "../../shape/loop.js";
import type { _X_ } from "../../get-critical-points/-x-.js";
import { eps } from "flo-poly";
import { getBezierTurnarounds } from "../../bezier/get-bezier-turnarounds.js";


function getTurnarounds(
        loops: Loop[]): [_X_,_X_][] {

    return loops.map(loop => {
        return loop.curves.map(curve => {
            const { ps } = curve;
            const { turnaroundXs, turnaroundYs } = getBezierTurnarounds(ps);

            return [...turnaroundXs, ...turnaroundYs].map((ta): [_X_,_X_] => {
                const { p, t } = ta;
                const _x_: _X_ = {
                    curve,
                    x: {
                        p,
                        ri: { t, tS: t - 4*eps, tE: t + 4*eps, multiplicity: 1 },  // TODO - check eps error is correct here
                        kind: 8
                    },
                    next: undefined!,  // will be set later
                    prev: undefined!,   // ...
                    container: undefined!
                };

                return [_x_, {..._x_ }];
                // return [_x_];
            })
        });
    }).flat(2);
}


export { getTurnarounds }
