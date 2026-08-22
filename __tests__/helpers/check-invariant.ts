import { Invariants } from "./invariants.js";
import { Tolerance } from "./tolerance.js";

const { abs } = Math;

/**
* 
* @param invariantCalc calculated invariants
* @param invariantReq required invariants
*/
function checkInvariant(
        fileName: string,
        invariantCalc: Invariants, 
        invariantReq: Invariants, 
        tolerance: Tolerance) {

    let { area: area_, centroid: centroid_, bounds: bounds_ } =  invariantCalc;
    let { area, centroid, bounds } =  invariantReq;

    // if (abs(area - area_) > tolerance.area) {
    if (abs(area) - abs(area_) > tolerance.area) {
        throw new Error(`${fileName}: Area not within tolerance. Found ${area_} - should be ${area}`);
    }
    if (abs(centroid[0] - centroid_[0]) > tolerance.centroid ||
        abs(centroid[1] - centroid_[1]) > tolerance.centroid) {

        throw new Error(
            `${fileName}: Centroid not within tolerance. Calc: ${JSON.stringify(centroid_)}, required: ${JSON.stringify(centroid)}, ` + `\n` +
            `delta x,y: ${centroid[0] - centroid_[0]}, ${centroid[1] - centroid_[1]}`
        );
    }

    const minXDelta = bounds.minX - bounds_.minX;
    const minYDelta = bounds.minY - bounds_.minY;
    const maxXDelta = bounds.maxX - bounds_.maxX;
    const maxYDelta = bounds.maxY - bounds_.maxY;
    if (abs(bounds.minX - bounds_.minX) > tolerance.bounds ||
        abs(bounds.minY - bounds_.minY) > tolerance.bounds ||
        abs(bounds.maxX - bounds_.maxX) > tolerance.bounds ||
        abs(bounds.maxY - bounds_.maxY) > tolerance.bounds) {

        throw new Error(
            `${fileName}: Bounds not within tolerance.`
        );
    }

    return true &&
        abs(area) - abs(area_) <= tolerance.area &&
        abs(centroid[0] - centroid_[0]) <= tolerance.centroid &&
        abs(centroid[1] - centroid_[1]) <= tolerance.centroid &&
        abs(bounds.minX - bounds_.minX) <= tolerance.bounds &&
        abs(bounds.minY - bounds_.minY) <= tolerance.bounds &&
        abs(bounds.maxX - bounds_.maxX) <= tolerance.bounds &&
        abs(bounds.maxY - bounds_.maxY) <= tolerance.bounds;
}


export { checkInvariant }
