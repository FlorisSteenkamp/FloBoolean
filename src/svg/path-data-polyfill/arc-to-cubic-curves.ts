
// TODO - use better function for arcToCubicCurves, e.g. start with a circular
// arc (easily approximated by a cubic bezier) and apply transformations as 
// required

/** 
 * @hidden
 * Get an array of corresponding cubic bezier curve parameters for given arc 
 * curve paramters.
 */
function arcToCubicCurves(
        x1: number, 
        y1: number, 
        x2: number, 
        y2: number, 
        r1: number, 
        r2: number, 
        angle: number, 
        largeArcFlag: number, 
        sweepFlag: number, 
        _recursive: number[]): number[][] {

      
    const angleRad = degToRad(angle);
    let params: number[][] = [];
    let f1, f2, cx, cy;

    if (_recursive) {
        f1 = _recursive[0];
        f2 = _recursive[1];
        cx = _recursive[2];
        cy = _recursive[3];
    } else {
        const p1 = rotate(x1, y1, -angleRad);
        x1 = p1.x;
        y1 = p1.y;

        const p2 = rotate(x2, y2, -angleRad);
        x2 = p2.x;
        y2 = p2.y;

        const x = (x1 - x2) / 2;
        const y = (y1 - y2) / 2;
        let h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);

        if (h > 1) {
            h = Math.sqrt(h);
            r1 = h * r1;
            r2 = h * r2;
        }

        const sign = largeArcFlag === sweepFlag ? -1 : +1;
        const r1Pow = r1 * r1;
        const r2Pow = r2 * r2;

        const left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
        const right = r1Pow * y * y + r2Pow * x * x;

        const k = sign * Math.sqrt(Math.abs(left/right));

        cx = k * r1 * y / r2 + (x1 + x2) / 2;
        cy = k * -r2 * x / r1 + (y1 + y2) / 2;

        f1 = Math.asin( Number(((y1 - cy) / r2).toFixed(9)) );
        f2 = Math.asin( Number(((y2 - cy) / r2).toFixed(9)) );

        if (x1 < cx) {
            f1 = Math.PI - f1;
        }
        if (x2 < cx) {
            f2 = Math.PI - f2;
        }

        if (f1 < 0) {
            f1 = Math.PI * 2 + f1;
        }
        if (f2 < 0) {
            f2 = Math.PI * 2 + f2;
        }

        if (sweepFlag && f1 > f2) {
            f1 = f1 - Math.PI * 2;
        }
        if (!sweepFlag && f2 > f1) {
            f2 = f2 - Math.PI * 2;
        }
      }

      let df = f2 - f1;

      if (Math.abs(df) > (Math.PI * 120 / 180)) {
        const f2old = f2;
        const x2old = x2;
        const y2old = y2;

        if (sweepFlag && f2 > f1) {
            f2 = f1 + (Math.PI * 120 / 180) * (1);
        }
        else {
            f2 = f1 + (Math.PI * 120 / 180) * (-1);
        }

        x2 = cx + r1 * Math.cos(f2);
        y2 = cy + r2 * Math.sin(f2);
        params = arcToCubicCurves(
            x2, y2, x2old, y2old, 
            r1, r2, angle, 0, 
            sweepFlag, [f2, f2old, cx, cy]
        );
    }

    df = f2 - f1;

    const c1 = Math.cos(f1);
    const s1 = Math.sin(f1);
    const c2 = Math.cos(f2);
    const s2 = Math.sin(f2);
    const t = Math.tan(df / 4);
    const hx = 4 / 3 * r1 * t;
    const hy = 4 / 3 * r2 * t;

    const m1 = [x1, y1];
    const m2 = [x1 + hx * s1, y1 - hy * c1];
    const m3 = [x2 + hx * s2, y2 - hy * c2];
    const m4 = [x2, y2];

    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];

    if (_recursive) {
        //return [m2, m3, m4].concat(params);
        return [m2, m3, m4, ...params];
    } else {
        //params = [m2, m3, m4].concat(params).join().split(",");
        const params2: number[] = [].concat(m2, m3, m4, ...params);

        const curves: number[][] = [];
        let curveParams: number[] = [];

        params2.forEach(function(param: number, i: number) {
            if (i % 2) {
                curveParams.push(rotate(params2[i - 1], params2[i], angleRad).y);
            } else {
                curveParams.push(rotate(params2[i], params2[i + 1], angleRad).x);
            }

            if (curveParams.length === 6) {
                curves.push(curveParams);
                curveParams = [];
            }
        });

        return curves;
    }
}


/**
 * @hidden
 * @param x 
 * @param y 
 * @param angleRad 
 */
function rotate(
        x: number, 
        y: number, 
        angleRad: number): { x: number, y: number } {

    const X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
    const Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
    
    return {x: X, y: Y};
}


/**
 * @hidden
 * @param degrees 
 */
function degToRad(degrees: number) {
    return (Math.PI * degrees) / 180;
}


export { arcToCubicCurves }
