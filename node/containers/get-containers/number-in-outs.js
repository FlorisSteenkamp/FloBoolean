/**
 * Simply gives each `InOut` within all containers a unique `idx`
 *
 * @param containers
 */
function numberInOuts(containers) {
    let ioIdx = 0;
    for (const container of containers) {
        for (const inOut of container.inOuts) {
            inOut.idx = ++ioIdx;
        }
    }
}
export { numberInOuts };
//# sourceMappingURL=number-in-outs.js.map