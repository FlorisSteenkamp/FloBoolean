import { flatCoefficients } from "flo-poly";
import { cubicThroughPointGiven013 } from "flo-bezier3";
import { generateRandomPoints } from "./generate-random-points.js";
import { Loop, loopFromBeziers } from "../loop.js";


function randomSeed() {
    return Math.round(Math.random() * 1000000);
}


/**
 * Returns an array of random loops.
 * @param psi 
 * @param ps 
 * @param SEED a random seed
 * @param blockSize
 * @param s
 * @param bezierCount
 */
function generateRandomLoops(
        blockSize: number, 
        s: number,
        bezierCount: number,
        numPoints: number,
        SEED1 = randomSeed(), 
        SEED2 = randomSeed(), 
        SEED3 = randomSeed()) {

    let ps = generateRandomPoints(numPoints, s, SEED1);
    let psi = randomPointsInOutBlock(SEED2, blockSize, s, 4*bezierCount);
    let randoms1 = flatCoefficients(psi.length, 0.1, 0.9, SEED3);
    let vs = randoms1.p;
    let loops: Loop[] = [];

    let bzs: number[][][] = [];
    let j = 0;
    for (let i=0; i<psi.length; i++) {
        if ((i+1) % 4 === 0) { 
            let bz = cubicThroughPointGiven013(
                [psi[i], psi[i-1], psi[i-2], psi[i-3]], // 3rd point is ignored
                ps[j],
                vs[i]
            );
            j++;
            bzs.push(bz);

            // stick endpoints together
            if (j % 2 === 0) { 
                let len = bzs.length;
                let bz1 = bzs[len-2];
                let bz2 = bzs[len-1];
                let ep1S = bz1[0];
                let ep1E = bz1[3];
                let ep2S = bz2[0];
                let ep2E = bz2[3];
                bzs.push([ep1E, ep2S]);
                bzs.push([ep2E, ep1S]);

                loops.push(
                    loopFromBeziers(
                        [bzs[len-2], 
                        bzs[len], 
                        bzs[len-1], 
                        bzs[len+1]]
                    )
                );
            }
        }
    }

    return loops;
}


/**
 * 
 * @param SEED a random seed
 * @param width a range within which x-y coordinates of points are allowed to 
 * be -> [-width, +width]
 * @param exclWidth a range within which x-y coordinates of points are *not*
 * allowed to be -> [-exclWidth, +exclWidth]
 * @param n the number of points to generate
 */
function randomPointsInOutBlock(SEED: number, width: number, exclWidth: number, n: number) {
    let randoms1 = flatCoefficients(10*n, -width, +width, SEED);
    let vs = randoms1.p.map(Math.round);
    let ps: number[][] = [];
    for (let i=0; i<10*n; i++) {
        let p = [vs[i*2], vs[i*2+1]];
        if (!inRect(p, [[-exclWidth,-exclWidth],[exclWidth,exclWidth]])) {
            ps.push(p);
        }
    }
    return ps.slice(0,n);
}


function inRect(p: number[], rect: number[][]) {
    let [[left,top], [right,bottom]] = rect;

    return (p[0] > left && p[0] < right && p[1] > top && p[1] < bottom);
}


export { generateRandomLoops }
