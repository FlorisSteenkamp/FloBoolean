import { evalDeCasteljauDd } from 'flo-bezier3';


/** Flattens one loop into directed line segments appended to `segs`. */
function flattenLoop(
        numSegments: number,
        loop: (number[][])[],
        segs: number[][]) {

    let first: [number, number] | null = null;
    let prev: [number, number] | null = null;
    for (const ps of loop) {
        if (first === null) {
            first = [ps[0][0], ps[0][1]];
            prev = first;
        }
        for (let i = 1; i <= numSegments; i++) {
            const pt = evalDeCasteljauDd(ps, [0, i / numSegments]).map(c => c[1]) as [number, number];
            segs.push([prev![0], prev![1], pt[0], pt[1]]);
            prev = pt;
        }
    }
    // Close the loop if it isn't already closed.
    if (first && prev && (prev[0] !== first[0] || prev[1] !== first[1])) {
        segs.push([prev[0], prev[1], first[0], first[1]]);
    }
}


export { flattenLoop }
