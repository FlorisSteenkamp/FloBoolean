import { roots } from 'flo-poly';
import { toPowerBasis, tangent, evalDeCasteljau } from 'flo-bezier3';
import { toUnitVector, translate } from 'flo-vector2d';
import { getBoundingBox$ } from '../get-bounding-box-.js';
import { getShapeBounds } from './get-shape-bounds.js';
import { squares } from 'squares-rng';


// FUTURE - remove delta; probably not necessary
const DELTA = 1e-6;


type Dir =
    | 'left'
    | 'right'
    | 'down'
    | 'up';


/**
 * Returns true if the first loop is wholly contained within the second loop's
 * boundary. 
 * 
 * * precondition: the loop must either wholly contained inside the loop or is wholly outside.
 * 
 * @param loop1
 * @param loop2
 */
function isLoopInLoop(
        loop1: number[][][],
        loop2: number[][][]) {

    let i = 0;
    do {
        i++;

        // Gets a predictable random number between 0 and 1
        const t = squares(i)/0x1_0000_0000;
        
        // Gets a predictable random number between 0 and the number of
        // curves in the loop.
        const idx = squares(i+1000)%loop1.length;

        const ps = loop1[idx];
        const p = evalDeCasteljau(ps, t);

        const r = f(loop1, loop2, p);
        
        if (r !== undefined) {
            return r;
        }
    } while (i < 100);

    return undefined; // There's no chance we'll get up to this point.


    function f(
            loop1: number[][][],
            loop2: number[][][],
            p: number[]) {

        if (isLoopNotInLoop(loop1, loop2)) {
            return false;
        }

        const count = getAxisAlignedRayLoopIntersections(loop2, p, 'left');
        if (count !== undefined) { return count%2 !== 0; }
    }
}


/**
 * Returns `true` if the first loop is not wholly within the second. The converse
 * is not necessarily true. It is assumed the loops don't intersect.
 * 
 * @param loops
 */
function isLoopNotInLoop(
        loop1: number[][][],
        loop2: number[][][]) {

    const bounds1 = getShapeBounds(loop1);
    const bounds2 = getShapeBounds(loop2);
    
    return (
        bounds1.minX < bounds2.minX || 
        bounds1.maxX > bounds2.maxX ||
        bounds1.minY < bounds2.minY || 
        bounds1.maxY > bounds2.maxY
    );
}


/**
 * @param loop a loop of curves
 * @param p the point where the horizontal ray starts
 * @param dir the ray direction
 */
function getAxisAlignedRayLoopIntersections(
        loop: number[][][],
        p: number[],
        dir: Dir) {

    const [x,y] = p;
    let count = 0;

    for (let i=0; i<loop.length; i++) {
        const ps = loop[i];

        //------------------------------------------------------/
        //---- Check if ray intersects bezier bounding box -----/
        //------------------------------------------------------/
        const [[minX,minY],[maxX,maxY]] = getBoundingBox$(ps);
        let notIntersecting = 
            ((dir === 'left' || dir === 'right') && (minY > y || maxY < y)) ||
            ((dir === 'up'   || dir === 'down' ) && (minX > x || maxX < x));
        notIntersecting = notIntersecting ||
            (dir === 'left' && minX > x) || (dir === 'right' && maxX < x) ||
            (dir === 'down' && minY > y) || (dir === 'up'    && maxY < y);

        if (notIntersecting) { continue; } // No intersection with bezier


        //------------------------------------------------------/
        //----------- Get intersection ts on bezier ------------/
        //------------------------------------------------------/
        // Get the bezier's x-coordinate power representation.
        const ts: number[] = [];
        
        let f;
        let offset;
        let axis;
        const dirIsDecreasing = (dir === 'left' || dir === 'up');
        if (dir === 'left' || dir === 'right') {
            f = (ps: number[][]) => toPowerBasis(ps)[1];
            offset = [0,-y];
            axis = 0;
        } else {
            f = (ps: number[][]) => toPowerBasis(ps)[0];
            offset = [-x,0];
            axis = 1;
        }

        const translatedPs = ps.map(translate(offset));
        const poly = f(translatedPs); 
        const ts_ = roots(poly, 0 - DELTA, 1 + DELTA)?.map(r => r.t) || [];
        
        for (let i=0; i<ts_.length; i++) {
            const t = ts_[i];

            if (Math.abs(t) < DELTA || Math.abs(t-1) < DELTA) {
                // We don't know the exact number of intersections due to
                // floating point arithmetic. 
                return undefined;
            }
            
            const p_ = evalDeCasteljau(translatedPs,t);
            if (( dirIsDecreasing && p[axis] >= p_[axis]) || 
                (!dirIsDecreasing && p[axis] <= p_[axis])) {

                ts.push(t);
            }
        }


        //------------------------------------------------------/
        //----- Check if line is tangent to intersections ------/
        //------------------------------------------------------/
        // We only care if there were 1 or 3 intersections.
        if (ts.length === 1 || ts.length === 3) {
            for (const t of ts) {
                const tan = toUnitVector(tangent(ps, t));
                if (((dir === 'left' || dir === 'right') && Math.abs(tan[1]) < DELTA) ||
                    ((dir === 'down' || dir === 'up'   ) && Math.abs(tan[0]) < DELTA)) {
                    
                    // We don't know the exact number of intersections due to
                    // floating point arithmetic
                    return undefined; 
                }
            }
        }

        count += ts.length;
    }

    return count;
}


export { isLoopInLoop }
