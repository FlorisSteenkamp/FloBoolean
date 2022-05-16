/**
 * Draws an SVG shape
 * @param g
 * @param shape the shape specified as an array of bezier curves
 *
 * * the last point does not have to be specified
 *
 * @param class_
 * @param delay
 */
declare function drawShape(g: SVGGElement, beziers: number[][][], class_?: string, delay?: number): SVGPathElement[];
export { drawShape };
