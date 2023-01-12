/**
 * Set each intersection on the given original loop's `next` and `prev` value.
 *
 * @param xPairs
 */
function setIntersectionNextValues(xPairs) {
    const xsByLoop = new Map();
    for (const xPair of xPairs) {
        for (const x_ of xPair) {
            const loop = x_.curve.loop;
            const xs_ = xsByLoop.get(loop) || [];
            if (!xs_.length) {
                xsByLoop.set(loop, xs_);
            }
            xs_.push(x_);
        }
    }
    for (const item of xsByLoop) {
        const xs = item[1];
        if (!xs || !xs.length) {
            continue;
        }
        xs.sort((xA, xB) => {
            let res = xA.curve.idx - xB.curve.idx;
            if (res !== 0) {
                return res;
            }
            res = xA.x.ri.tS - xB.x.ri.tS;
            if (res !== 0) {
                return res;
            }
            return xA.in_ !== undefined ? -1 : +1;
        });
        const len = xs.length;
        for (let i = 0; i < len; i++) {
            xs[i].next = xs[(i + 1) % len];
        }
    }
}
export { setIntersectionNextValues };
//# sourceMappingURL=set-intersection-next-values.js.map