/**
 * Returns true if the container contains only 1 interface
 * intersection or contains only 1 general, extreme or loop intersection
 * (not cusp, or endpoint overlap), false otherwise.
 *
 * @param container
 */
function containerIsBasic(container) {
    const xs = container.xs;
    if (xs.length === 4) {
        let topmostCount = 0;
        let interfaceCount = 0;
        for (let i = 0; i < xs.length; i++) {
            if (xs[i].x.kind === 0) {
                topmostCount++;
            }
            if (xs[i].x.kind === 4) {
                interfaceCount++;
            }
        }
        // topmostCount;//?
        // interfaceCount;//?
        if (topmostCount === 2 && interfaceCount === 2) {
            return true;
        }
    }
    if (xs.length <= 2 && xs[0].x.kind !== 7) {
        return true;
    }
    // xs.length;//?
    return false;
}
export { containerIsBasic };
//# sourceMappingURL=container.js.map