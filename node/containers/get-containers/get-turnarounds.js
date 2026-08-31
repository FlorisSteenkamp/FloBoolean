import { getBezierTurnarounds } from "../../bezier/get-bezier-turnarounds.js";
import { toP } from "../../utils/to-p.js";
function getTurnarounds(loops) {
    const turnarounds = [];
    for (let loop of loops) {
        for (let curve of loop.curves) {
            const { ps } = curve;
            const xPairs = getBezierTurnarounds(ps)
                .map((ri) => {
                const { t } = ri;
                const p = toP(ps, t);
                // `next`, `prev`, `container` will be set later
                const xA = { p, ri, kind: 8, curve };
                const xB = { p, ri, kind: 8, curve };
                return [xA, xB];
            });
            turnarounds.push(...xPairs);
        }
    }
    return turnarounds;
}
export { getTurnarounds };
//# sourceMappingURL=get-turnarounds.js.map