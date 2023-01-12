import { flatCoefficients } from "flo-poly";


/**
 * Returns a specified number of random integer-coordinate points within a given
 * range
 * @param n the number of points to generate
 * @param width the range of the x-y values -> [-width, +width]
 * @param SEED a random seed
 */
function generateRandomPoints(n: number, width: number, SEED: number) {
    // get random values in [-width,+width]
    const randoms1 = flatCoefficients(2*n, -width, +width, SEED);
    const vs = randoms1.p.map(Math.round);
    const ps: number[][] = [];
    for (let i=0; i<n; i++) {
        ps.push([vs[i*2], vs[i*2+1]]);
    }
    return ps;
}


export { generateRandomPoints }
