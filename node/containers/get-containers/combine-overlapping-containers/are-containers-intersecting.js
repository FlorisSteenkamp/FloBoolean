import { areBoxesIntersecting } from "../../../geometry/are-boxes-intersecting.js";
/** Fraction of its own width/height by which a container box is grown on every
 * side before testing for overlap when deciding whether to merge containers. */
const CONTAINER_MERGE_ENLARGE_FRAC = 0.5;
/**
 * Enlarges an axis-aligned box by `frac` of its size on every side (e.g.
 * `frac === 0.5` grows each side by 50% of the box's width/height).
 */
function enlargeBox(box, frac) {
    let [[x0, y0], [x1, y1]] = box;
    if (x0 > x1) {
        [x0, x1] = [x1, x0];
    }
    if (y0 > y1) {
        [y0, y1] = [y1, y0];
    }
    const dx = (x1 - x0) * frac;
    const dy = (y1 - y0) * frac;
    return [[x0 - dx, y0 - dy], [x1 + dx, y1 + dy]];
}
function areContainersIntersecting(container1, container2) {
    return areBoxesIntersecting(true, enlargeBox(container1.box, CONTAINER_MERGE_ENLARGE_FRAC), enlargeBox(container2.box, CONTAINER_MERGE_ENLARGE_FRAC));
}
export { areContainersIntersecting, enlargeBox, CONTAINER_MERGE_ENLARGE_FRAC };
//# sourceMappingURL=are-containers-intersecting.js.map