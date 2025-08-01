import { flatCoefficients, allRoots } from 'flo-poly';
import { toPowerBasis, tangent, evalDeCasteljau } from 'flo-bezier3';
import { toUnitVector, translate } from 'flo-vector2d';
import { getBoundingBox_ } from '../get-bounding-box-';
import { getBounds_ } from '../get-bounds-';


// TODO - remove delta by basing isLoopInLoop on a solid numerical analytic 
// basis - isLoopInLoop is the only sub-algorithm left having a DELTA.
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
 * Precondition: the loop is either wholly contained inside the loop or is wholly outside.
 * @param loop1
 * @param loop2
 */
function isLoopInLoop(loop1: number[][][], loop2: number[][][]) {

    let i = 0;
    let seed = 1231; // Just some value
    do {
        i++;

        // This gets us a predictable random number between 0 and 1;
        const rand1 = flatCoefficients(1, 0, 1, seed);
        const t = rand1.p[0];
        seed = rand1.seed; // Get next seed.
        
        // This gets us a predictable random number roughly between 0 and the 
        // number of curves in the loop.
        const curveCount = loop1.length;
        const rand2 = flatCoefficients(1, 0, curveCount, seed);
        
        const idx = Math.floor(rand2.p[0]);
        seed = rand2.seed; // Get next seed.

        const ps = loop1[idx];
        const p = evalDeCasteljau(ps, t);

        const res = f(loop1, loop2, p);
        
        if (res !== undefined) {
            return res;
        }        
    } while (i < 100);

    return undefined; // There's no chance we'll get up to this point.


    function f(loop1: number[][][], loop2: number[][][], p: number[]) {
        if (isLoopNotInLoop(loop1, loop2)) {
            return false;
        }

        const count = getAxisAlignedRayLoopIntersections(loop2, p, 'left');
        if (count !== undefined) { return count % 2 !== 0; }
    }
}


/**
 * Returns true if the first loop is not wholly within the second. The converse
 * is not necessarily true. It is assumed the loops don't intersect.
 * @param loops
 */
function isLoopNotInLoop(loop1: number[][][], loop2: number[][][]) {
    const boundss = [loop1, loop2].map(getLoopBounds);
    
    return (
        boundss[0].minX < boundss[1].minX || 
        boundss[0].maxX > boundss[1].maxX ||
        boundss[0].minY < boundss[1].minY || 
        boundss[0].maxY > boundss[1].maxY
    );
}


function getLoopBounds(pss: number[][][]) {
    const bounds = pss.map(ps => getBounds_(ps))
    return {
		minX: Math.min(...bounds.map(bound => bound.box[0][0])),
        maxX: Math.max(...bounds.map(bound => bound.box[1][0])),
        minY: Math.min(...bounds.map(bound => bound.box[0][1])),
		maxY: Math.max(...bounds.map(bound => bound.box[1][1])),
	};
}


/**
 * @param p The point where the horizontal ray starts
 * @param toLeft The ray to the left of this point (else right)
 * @param loop A loop of curves
 * 
 * @internal
 */
function getAxisAlignedRayLoopIntersections(
        loop: number[][][], p: number[], dir: Dir) {

    const [x,y] = p;
    let count = 0;

    for (let i=0; i<loop.length; i++) {
        const ps = loop[i];

        //------------------------------------------------------/
        //---- Check if ray intersects bezier bounding box -----/
        //------------------------------------------------------/
        const [[minX,minY],[maxX,maxY]] = getBoundingBox_(ps);
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
            //f = getY;
            f = (ps: number[][]) => toPowerBasis(ps)[1];
            offset = [0,-y];
            axis = 0;
        } else {
            //f = getX;
            f = (ps: number[][]) => toPowerBasis(ps)[0];
            offset = [-x,0];
            axis = 1;
        }

        //let translatedPs = translate(offset, ps);
        const translatedPs = ps.map(translate(offset));
        const poly = f(translatedPs); 
        //let ev = evalDeCasteljau(translatedPs);
        const ts_ = allRoots(poly,0-DELTA,1+DELTA);
        
        for (let i=0; i<ts_.length; i++) {
            const t = ts_[i];

            if (Math.abs(t) < DELTA || Math.abs(t-1) < DELTA) {
                // We don't know the exact number of intersections due to
                // floating point arithmetic. 
                return undefined;
            }
            
            //let p_ = ev(t);
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
