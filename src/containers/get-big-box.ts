
const { abs } = Math;


/**
 * Returns the largest rectangle surrounding a given point without any of the
 * given rects being strictly inside it (the rects are allowed to touch the
 * returned rectangle's edges).
 * 
 * * **precondition**: no rect contains `p` and the rects don't overlap each
 * other.
 * 
 * Each rect blocks the box on the side of the rect facing `p`, chosen as
 * follows from `p`'s position relative to the rect's spans:
 * * `p` overlaps the rect in y only -> block the near x-edge.
 * * `p` overlaps the rect in x only -> block the near y-edge.
 * * `p` separated from the rect on both axes (diagonal) -> block the dominant
 *   axis of the rect's near corner (the larger absolute offset from `p`), a
 *   45-degree corner blocking both axes.
 * 
 * The blocking edge is placed exactly on the rect's near edge, so the rect is
 * never strictly inside, and the most restrictive constraint is kept per edge.
 * This degenerates to the point version when a rect shrinks to a point.
 * 
 * @param rects the rects that must stay outside (or on the edge of) the box,
 * each given as `[[minX, minY], [maxX, maxY]]`
 * @param p the point the box must surround
 * @returns the box as `[[minX, minY], [maxX, maxY]]`
 */
function getBigBox(
        expMax: number,
        rects: number[][][],
        p: number[]): number[][] {

    let MAX = 2**(expMax + 1);

    const [px, py] = p;

    let minX = -MAX;
    let minY = -MAX;
    let maxX = +MAX;
    let maxY = +MAX;

    for (const [[rMinX, rMinY], [rMaxX, rMaxY]] of rects) {
        // `p`'s position relative to the rect on each axis. `sep === 0` means
        // `p`'s coordinate lies within the rect's span (they overlap on that
        // axis); otherwise `near` is the rect edge facing `p`.
        let xSep = 0; let nearX = 0;
        if (px < rMinX)      { xSep = +1; nearX = rMinX; }
        else if (px > rMaxX) { xSep = -1; nearX = rMaxX; }

        let ySep = 0; let nearY = 0;
        if (py < rMinY)      { ySep = +1; nearY = rMinY; }
        else if (py > rMaxY) { ySep = -1; nearY = rMaxY; }

        // Decide which edge(s) this rect blocks.
        let blockX = false;
        let blockY = false;
        if (xSep !== 0 && ySep === 0) {
            blockX = true;   // overlaps `p` in y -> must block the near x-edge
        } else if (ySep !== 0 && xSep === 0) {
            blockY = true;   // overlaps `p` in x -> must block the near y-edge
        } else if (xSep !== 0 && ySep !== 0) {
            // diagonal -> dominant axis of the near corner (ties block both)
            const adx = abs(nearX - px);
            const ady = abs(nearY - py);
            blockX = adx >= ady;
            blockY = ady >= adx;
        }
        // else `p` is inside the rect -> precondition violated; ignore

        if (blockX) {
            if (xSep > 0) { if (nearX < maxX) { maxX = nearX; } }
            else          { if (nearX > minX) { minX = nearX; } }
        }
        if (blockY) {
            if (ySep > 0) { if (nearY < maxY) { maxY = nearY; } }
            else          { if (nearY > minY) { minY = nearY; } }
        }
    }

    // Halve each side's distance from `p`, keeping `p` fixed as the "center".
    return [
        [(px + minX) / 2, (py + minY) / 2],
        [(px + maxX) / 2, (py + maxY) / 2],
    ];
}


export { getBigBox }



