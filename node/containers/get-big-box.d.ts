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
declare function getBigBox(expMax: number, rects: number[][][], p: number[]): number[][];
export { getBigBox };
