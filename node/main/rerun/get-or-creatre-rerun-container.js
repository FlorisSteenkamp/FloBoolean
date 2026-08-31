/**
 * Rebuild container for `container.idx` created on first use.
 */
function getOrCreateRerunContainer(containers_, container) {
    const { idx } = container;
    let container_ = containers_[idx];
    if (container_ === undefined) {
        container_ = {
            bigBox: container.bigBox,
            box: container.box,
            inOuts: [],
            xs: container.xs
        };
        containers_[idx] = container_;
    }
    return container_;
}
export { getOrCreateRerunContainer };
//# sourceMappingURL=get-or-creatre-rerun-container.js.map