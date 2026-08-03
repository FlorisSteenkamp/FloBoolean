import { evalDeCasteljau } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
function drawMinY(g, pos) {
    const p = evalDeCasteljau(pos.curve.ps, pos.t);
    const $elems = drawFs.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
export { drawMinY };
//# sourceMappingURL=draw-min-y.js.map