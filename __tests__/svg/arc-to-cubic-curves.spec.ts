import { test, expect } from '@jest/globals';
import { evalDeCasteljau } from 'flo-bezier3';
import { arcToCubicCurves } from '../../src/svg/path-data-polyfill/arc-to-cubic-curves.ts';

const { sin, cos, sqrt, abs, PI, max, min, hypot, acos, atan2 } = Math;


//------------------------------------------------------------------------------
// Test helpers
//------------------------------------------------------------------------------

type Pt = number[];


/**
 * The function returns each cubic as a flat `[c1x,c1y,c2x,c2y,ex,ey]` (control
 * point 1, control point 2, end point) - the start point is implicit (the arc
 * start for the first curve, the previous end thereafter). Reconstruct the full
 * 4-control-point sets.
 */
function toControlPoints(start: Pt, flatCurves: number[][]): Pt[][] {
    const out: Pt[][] = [];
    let cur = start;
    for (const c of flatCurves) {
        const p1 = [c[0], c[1]];
        const p2 = [c[2], c[3]];
        const p3 = [c[4], c[5]];
        out.push([cur, p1, p2, p3]);
        cur = p3;
    }
    return out;
}

function angleBetween(ux: number, uy: number, vx: number, vy: number): number {
    const dot = ux*vx + uy*vy;
    const len = sqrt((ux*ux + uy*uy) * (vx*vx + vy*vy));
    let ang = acos(min(1, max(-1, dot/len)));
    if (ux*vy - uy*vx < 0) { ang = -ang; }
    return ang;
}

/**
 * Independent SVG-spec (F.6.5) endpoint -> center parameterization. Returns the
 * intended ellipse (center, possibly-corrected radii, rotation) plus the start
 * angle and signed sweep angle. This is the oracle the produced cubics are
 * checked against.
 */
function arcOracle(
        x1: number, y1: number, x2: number, y2: number,
        rx: number, ry: number, phiDeg: number, fA: number, fS: number) {

    const phi = phiDeg * PI / 180;
    const cosP = cos(phi), sinP = sin(phi);

    const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
    const x1p =  cosP*dx + sinP*dy;
    const y1p = -sinP*dx + cosP*dy;

    rx = abs(rx); ry = abs(ry);
    const lambda = (x1p*x1p)/(rx*rx) + (y1p*y1p)/(ry*ry);
    if (lambda > 1) { const s = sqrt(lambda); rx *= s; ry *= s; }

    const sign = (fA !== fS) ? 1 : -1;
    const num = rx*rx*ry*ry - rx*rx*y1p*y1p - ry*ry*x1p*x1p;
    const den = rx*rx*y1p*y1p + ry*ry*x1p*x1p;
    const co = sign * sqrt(max(0, num/den));
    const cxp =  co * (rx*y1p/ry);
    const cyp = -co * (ry*x1p/rx);

    const cx = cosP*cxp - sinP*cyp + (x1 + x2) / 2;
    const cy = sinP*cxp + cosP*cyp + (y1 + y2) / 2;

    const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
    const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;

    const theta1 = angleBetween(1, 0, ux, uy);
    let dTheta = angleBetween(ux, uy, vx, vy);
    if (fS === 0 && dTheta > 0) { dTheta -= 2*PI; }
    if (fS === 1 && dTheta < 0) { dTheta += 2*PI; }

    return { cx, cy, rx, ry, phi, theta1, dTheta };
}

type Ellipse = ReturnType<typeof arcOracle>;

/** Signed radial error of point `P` wrt the ellipse (0 == exactly on it). */
function ellipseRadialError(P: Pt, e: Ellipse): number {
    const cosP = cos(e.phi), sinP = sin(e.phi);
    const px = P[0] - e.cx, py = P[1] - e.cy;
    const u =  cosP*px + sinP*py;
    const v = -sinP*px + cosP*py;
    return sqrt((u*u)/(e.rx*e.rx) + (v*v)/(e.ry*e.ry)) - 1;
}

/**
 * Runs the conversion and asserts the core invariants an arc->cubic conversion
 * must satisfy, returning diagnostics for further per-case assertions.
 */
function checkArc(
        x1: number, y1: number, x2: number, y2: number,
        rx: number, ry: number, angle: number, fA: number, fS: number) {

    const flat = arcToCubicCurves(x1, y1, x2, y2, rx, ry, angle, fA, fS);

    expect(Array.isArray(flat)).toBe(true);
    expect(flat.length).toBeGreaterThan(0);
    for (const c of flat) { expect(c.length).toBe(6); }

    const cps = toControlPoints([x1, y1], flat);
    const e = arcOracle(x1, y1, x2, y2, rx, ry, angle, fA, fS);

    // (1) starts exactly at the arc start
    expect(hypot(cps[0][0][0] - x1, cps[0][0][1] - y1)).toBeLessThan(1e-9);

    // (2) ends exactly at the arc end
    const last = cps[cps.length - 1][3];
    expect(hypot(last[0] - x2, last[1] - y2)).toBeLessThan(1e-6);

    // (3) G0 continuity between consecutive cubics
    for (let i = 1; i < cps.length; i++) {
        const prevEnd = cps[i-1][3];
        const curStart = cps[i][0];
        expect(hypot(curStart[0] - prevEnd[0], curStart[1] - prevEnd[1])).toBeLessThan(1e-9);
    }

    // (4) every point of every cubic lies on the intended ellipse
    let maxErr = 0;
    for (const [p0, p1, p2, p3] of cps) {
        for (let k = 0; k <= 16; k++) {
            const P = evalDeCasteljau([p0, p1, p2, p3], k/16);
            maxErr = max(maxErr, abs(ellipseRadialError(P, e)));
        }
    }
    expect(maxErr).toBeLessThan(0.01);  // < 1% of the radius

    // (5) the arc has the correct extent & direction. Walk the produced curve,
    //     take each sampled point's angle in the ellipse frame, unwrap it, and
    //     confirm the total swept angle equals the oracle's signed sweep. This
    //     is resolution-independent and catches a wrong sweep / largeArc flag
    //     (which would keep the arc on the ellipse but sweep the wrong way or
    //     the wrong amount).
    const angleOf = (P: Pt): number => {
        const cosP = cos(e.phi), sinP = sin(e.phi);
        const px = P[0] - e.cx, py = P[1] - e.cy;
        const u = ( cosP*px + sinP*py) / e.rx;
        const v = (-sinP*px + cosP*py) / e.ry;
        return atan2(v, u);
    };
    let acc = 0;
    let prevRaw = 0;
    let first = true;
    for (const [p0, p1, p2, p3] of cps) {
        for (let k = 0; k <= 24; k++) {
            const raw = angleOf(evalDeCasteljau([p0, p1, p2, p3], k/24));
            if (first) { acc = raw; first = false; }
            else {
                let d = raw - prevRaw;
                while (d >  PI) { d -= 2*PI; }
                while (d < -PI) { d += 2*PI; }
                acc += d;
            }
            prevRaw = raw;
        }
    }
    const sweptTotal = acc - e.theta1;
    expect(abs(sweptTotal - e.dTheta)).toBeLessThan(1e-2);

    return { flat, cps, e, maxErr };
}


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

test('arcToCubicCurves - quarter circle (sweep 1)', () => {
    const { flat } = checkArc(1, 0, 0, 1, 1, 1, 0, 0, 1);
    expect(flat.length).toBe(1);  // <= 120 deg -> single cubic
});

test('arcToCubicCurves - quarter circle (sweep 0, other centre)', () => {
    checkArc(1, 0, 0, 1, 1, 1, 0, 0, 0);
});

test('arcToCubicCurves - semicircle (needs one 120 deg split)', () => {
    const { flat } = checkArc(1, 0, -1, 0, 1, 1, 0, 0, 1);
    expect(flat.length).toBe(2);  // 180 deg -> 120 + 60
});

test('arcToCubicCurves - semicircle (sweep 0)', () => {
    checkArc(1, 0, -1, 0, 1, 1, 0, 0, 0);
});

test('arcToCubicCurves - large 270 deg arc', () => {
    const { flat } = checkArc(1, 0, 0, 1, 1, 1, 0, 1, 1);
    expect(flat.length).toBeGreaterThanOrEqual(3);  // 270 deg -> >= 3 pieces
});

test('arcToCubicCurves - large 270 deg arc (sweep 0)', () => {
    checkArc(1, 0, 0, 1, 1, 1, 0, 1, 0);
});

test('arcToCubicCurves - rotated ellipse (rx != ry, 30 deg)', () => {
    // endpoints taken exactly on the ellipse: centre (0,0), rx=2, ry=1, rot 30 deg,
    // at parametric angles 0 deg and 90 deg
    const phi = 30 * PI / 180;
    const p = (th: number): Pt => {
        const ex = 2*cos(th), ey = 1*sin(th);
        return [ex*cos(phi) - ey*sin(phi), ex*sin(phi) + ey*cos(phi)];
    };
    const a = p(0), b = p(PI/2);
    checkArc(a[0], a[1], b[0], b[1], 2, 1, 30, 0, 1);
});

test('arcToCubicCurves - out-of-range radii are scaled up', () => {
    // endpoints 2 apart but radii only 0.5 -> radii must scale so the arc exists
    checkArc(-1, 0, 1, 0, 0.5, 0.5, 0, 0, 1);
});

test('arcToCubicCurves - near-full 350 deg arc', () => {
    const phi = 0;
    const p = (th: number): Pt => [cos(th), sin(th)];
    const a = p(0), b = p(-10 * PI / 180);  // 350 deg the long way round
    checkArc(a[0], a[1], b[0], b[1], 1, 1, phi, 1, 1);
});
