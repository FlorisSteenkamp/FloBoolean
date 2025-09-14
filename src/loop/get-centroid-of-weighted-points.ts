
/**
 * Returns the centroid of a 2d weighted point cloud.
 */
function getCentroidOfWeightedPoints(
        ps: number[][],
        weights: number[]) {

    let sumX = 0;
    let sumY = 0;
    let sumW = 0;
    for (let i=0; i<ps.length; i++) {
        const p = ps[i];
        const [x,y] = p;
        const w = weights[i];

        sumX += w*x;
        sumY += w*y;
        sumW += w;
    }
    if (sumW === 0) {
        return [0, 0];
    }
    return [
        sumX/sumW,
        sumY/sumW
    ];
}


export { getCentroidOfWeightedPoints }


// Quokka tests

// const ps = [[1,1], [2,2],[3,3]];
// const weights = [1,1,2];
// getCentroidOfWeightedPoints(ps, weights);//?
