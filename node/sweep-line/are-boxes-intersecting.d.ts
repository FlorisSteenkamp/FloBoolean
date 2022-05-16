/**
 * Returns true if the 2 given axis-aligned rectangular boxes intersect.
 * @param a An axis-aligned rectangular box
 * @param b Another axis-aligned rectangular box
 * @param closed (defaults to false) Interpret boxes as being closed (i.e. they
 * contain their border) or open. If open then if both boxes have zero area
 * then they are both considered close.
 */
declare function areBoxesIntersectingDd(closed: boolean): (a: number[][][], b: number[][][]) => boolean;
export { areBoxesIntersectingDd };
