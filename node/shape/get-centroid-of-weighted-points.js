/**
 * Returns the centroid of a 2d weighted point cloud.
 */
function getCentroidOfWeightedPoints(ps, weights) {
    let sumX = 0;
    let sumY = 0;
    let sumW = 0;
    for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const [x, y] = p;
        const w = weights[i];
        sumX += w * x;
        sumY += w * y;
        sumW += w;
    }
    if (sumW === 0) {
        return [0, 0];
    }
    return [
        sumX / sumW,
        sumY / sumW
    ];
}
export { getCentroidOfWeightedPoints };
//# sourceMappingURL=get-centroid-of-weighted-points.js.map