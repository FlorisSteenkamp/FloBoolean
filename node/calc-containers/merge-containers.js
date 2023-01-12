function mergeContainers(ccs) {
    const containers = [];
    for (const cc of ccs) {
        let minLeft = Number.POSITIVE_INFINITY;
        let minTop = Number.POSITIVE_INFINITY;
        let maxRight = Number.NEGATIVE_INFINITY;
        let maxBottom = Number.NEGATIVE_INFINITY;
        const xs = [];
        for (const c of cc) {
            const [[left, top], [right, bottom]] = c.box;
            if (left < minLeft) {
                minLeft = left;
            }
            if (top < minTop) {
                minTop = top;
            }
            if (right > maxRight) {
                maxRight = right;
            }
            if (bottom > maxBottom) {
                maxBottom = bottom;
            }
            xs.push(...c.xs);
        }
        // console.log(minLeft)
        const container = {
            box: [[minLeft, minTop], [maxRight, maxBottom]],
            xs: xs,
            inOuts: undefined
        };
        containers.push(container);
    }
    return containers;
}
export { mergeContainers };
//# sourceMappingURL=merge-containers.js.map