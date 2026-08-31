import { rotate } from 'flo-vector2d';
import { clamp } from '../../utils/clamp.js';
const { abs, sqrt, asin, sin, cos, tan, PI } = Math;
/**
 * Get an array of corresponding cubic bezier curve parameters for given arc
 * curve paramters.
 *
 * @internal
 */
function arcToCubicCurves(x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, _recursive) {
    const θ = degToRad(angle);
    let params = [];
    let f1, f2, cx, cy;
    if (_recursive) {
        f1 = _recursive[0];
        f2 = _recursive[1];
        cx = _recursive[2];
        cy = _recursive[3];
    }
    else {
        const sin_θ = sin(-θ);
        const cos_θ = cos(-θ);
        const rotate_θ = rotate(sin_θ, cos_θ);
        [x1, y1] = rotate_θ([x1, y1]);
        [x2, y2] = rotate_θ([x2, y2]);
        const x = (x1 - x2) / 2;
        const y = (y1 - y2) / 2;
        let h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);
        if (h > 1) {
            h = sqrt(h);
            r1 = h * r1;
            r2 = h * r2;
        }
        const sign = largeArcFlag === sweepFlag ? -1 : +1;
        const r1Pow = r1 * r1;
        const r2Pow = r2 * r2;
        const left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
        const right = r1Pow * y * y + r2Pow * x * x;
        const k = sign * sqrt(abs(left / right));
        cx = k * r1 * y / r2 + (x1 + x2) / 2;
        cy = k * -r2 * x / r1 + (y1 + y2) / 2;
        f1 = asin(clamp((y1 - cy) / r2, -1, 1));
        f2 = asin(clamp((y2 - cy) / r2, -1, 1));
        if (x1 < cx) {
            f1 = PI - f1;
        }
        if (x2 < cx) {
            f2 = PI - f2;
        }
        if (f1 < 0) {
            f1 = PI * 2 + f1;
        }
        if (f2 < 0) {
            f2 = PI * 2 + f2;
        }
        if (sweepFlag && f1 > f2) {
            f1 = f1 - PI * 2;
        }
        if (!sweepFlag && f2 > f1) {
            f2 = f2 - PI * 2;
        }
    }
    let df = f2 - f1;
    if (abs(df) > (PI * 120 / 180)) {
        const f2old = f2;
        const x2old = x2;
        const y2old = y2;
        f2 = f1 + (sweepFlag && f2 > f1 ? 1 : -1) * PI * 120 / 180;
        x2 = cx + r1 * cos(f2);
        y2 = cy + r2 * sin(f2);
        params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    const c1 = cos(f1);
    const s1 = sin(f1);
    const c2 = cos(f2);
    const s2 = sin(f2);
    const t = tan(df / 4);
    const hx = 4 / 3 * r1 * t;
    const hy = 4 / 3 * r2 * t;
    const m1 = [x1, y1];
    const m2 = [x1 + hx * s1, y1 - hy * c1];
    const m3 = [x2 + hx * s2, y2 - hy * c2];
    const m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (_recursive) {
        return [m2, m3, m4, ...params];
    }
    const params2 = [m2, m3, m4, ...params].flat();
    const curves = [];
    let curveParams = [];
    const sinθ = sin(θ);
    const cosθ = cos(θ);
    const rotateθ = rotate(sinθ, cosθ);
    params2.forEach(function (param, i) {
        if (i % 2) {
            const p = rotateθ([params2[i - 1], params2[i]]);
            curveParams.push(p[1]);
        }
        else {
            const p = rotateθ([params2[i], params2[i + 1]]);
            curveParams.push(p[0]);
        }
        if (curveParams.length === 6) {
            curves.push(curveParams);
            curveParams = [];
        }
    });
    return curves;
}
/**
 * @param degrees
 *
 * @internal
 */
function degToRad(degrees) {
    return (PI * degrees) / 180;
}
export { arcToCubicCurves };
//# sourceMappingURL=arc-to-cubic-curves.js.map