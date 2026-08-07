import { distanceBetween } from 'flo-vector2d';

const { min, sqrt } = Math;


function getClosestDistanceToRect(rect: number[][], p: number[]) {
    const tl = rect[0];
    const br = rect[1];
    const ps = [tl, br];

    return min(...ps.map(p_ => distanceBetween(p,p_)));
}


export { getClosestDistanceToRect }
