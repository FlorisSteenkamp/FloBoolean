import type { Curve } from '../../curve/curve.js';
declare function drawMinY(g: SVGGElement, pos: {
    curve: Curve;
    t: number;
    p: number[];
}): SVGElement[];
export { drawMinY };
