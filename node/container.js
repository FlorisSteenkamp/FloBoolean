/**
 * Returns true if the container is basic, i.e. contains only 1 interface
 * intersection or contains only 1 general, extreme or loop intersection
 * (not cusp, or endpoint overlap), false otherwise.
 *
 * @param container
 */
function containerIsBasic(expMax, container) {
    const xs = container.xs;
    if (xs.length <= 2 && xs[0].x.kind !== 7) {
        return true;
    }
    return false;
}
export { containerIsBasic };
//# sourceMappingURL=container.js.map