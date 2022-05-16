import { drawFs } from 'flo-draw';


/** @hidden */
function drawBoundingHull(
        g: SVGGElement,
        hull: number[][], 
        classes = 'thin5 black nofill',
        delay = 0) {
            
    let $polygon = drawFs.polygon(g, hull, classes, delay);

    return $polygon;
}


export { drawBoundingHull }
