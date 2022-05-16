import { Invariants } from "./invariants.js";
import { Tolerance } from "./tolerance.js";


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
