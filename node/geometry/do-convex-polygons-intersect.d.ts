/**
 * Adapted from https://stackoverflow.com/a/12414951/2010061.
 * Returns true if there is any intersection between the 2 polygons, false otherwise
 * Uses the Separating Axis Theorem.
 *
 * @param polygonA an array of connected points that form a closed polygon
 * @param polygonB an array of connected points that form a closed polygon
 * @param closed set to false to compare open polygons (not containing their
 * boundary) or true to compare closed polygons
 */
declare function doConvexPolygonsIntersect(polygonA: number[][], polygonB: number[][], closed: boolean): boolean;
export { doConvexPolygonsIntersect };
