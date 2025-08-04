import { Invariants } from "./invariants";
import { Tolerance } from "./tolerance";


/**
* 
* @param invariantCalc calculated invariants
* @param invariantReq required invariants
*/
function checkInvariant(
        invariantCalc: Invariants, 
        invariantReq: Invariants, 
        tolerance: Tolerance) {

    let { area: area_, centroid: centroid_, bounds: bounds_ } =  invariantCalc;
    let { area, centroid, bounds } =  invariantReq;

    if (Math.abs(area - area_) > tolerance.area) {
        throw new Error('Area not within tolerance.');
    }
    if (Math.abs(centroid[0] - centroid_[0]) > tolerance.centroid ||
        Math.abs(centroid[1] - centroid_[1]) > tolerance.centroid) {

        // centroid;//?
        // centroid_;//?
        // tolerance
        // centroid[0] - centroid_[0];//?
        // centroid[1] - centroid_[1];//?
        throw new Error(
            `Centroid not within tolerance. Calc: ${centroid_}, required: ${centroid}, ` + `\n` +
            `delta x,y: ${centroid[0] - centroid_[0]}, ${centroid[1] - centroid_[1]}`
        );
    }

    const minXDelta = bounds.minX - bounds_.minX;
    const minYDelta = bounds.minY - bounds_.minY;
    const maxXDelta = bounds.maxX - bounds_.maxX;
    const maxYDelta = bounds.maxY - bounds_.maxY;
    if (Math.abs(bounds.minX - bounds_.minX) > tolerance.bounds ||
        Math.abs(bounds.minY - bounds_.minY) > tolerance.bounds ||
        Math.abs(bounds.maxX - bounds_.maxX) > tolerance.bounds ||
        Math.abs(bounds.maxY - bounds_.maxY) > tolerance.bounds) {

        minXDelta;//?
        minYDelta;//?
        maxXDelta;//?
        maxYDelta;//?
        tolerance.bounds;//?

        throw new Error(
            `Bounds not within tolerance.`
        );
    }

    return true &&
        Math.abs(area - area_) <= tolerance.area &&
        Math.abs(centroid[0] - centroid_[0]) <= tolerance.centroid &&
        Math.abs(centroid[1] - centroid_[1]) <= tolerance.centroid &&
        Math.abs(bounds.minX - bounds_.minX) <= tolerance.bounds &&
        Math.abs(bounds.minY - bounds_.minY) <= tolerance.bounds &&
        Math.abs(bounds.maxX - bounds_.maxX) <= tolerance.bounds &&
        Math.abs(bounds.maxY - bounds_.maxY) <= tolerance.bounds;
}


export { checkInvariant }
