/**
 * * modifies `containers`
 */
function connectContainerInOuts(containers) {
    for (const container of containers) {
        for (const inOut of container.inOuts) {
            if (inOut.dir === +1) {
                const out = inOut;
                let { _x_ } = out;
                _x_ = _x_.next;
                out.twin = _x_.in_;
                out.idx = out.twin.idx;
            }
            else {
                const in_ = inOut;
                let { _x_ } = in_;
                _x_ = _x_.prev;
                in_.twin = _x_.out;
                in_.idx = in_.twin.idx;
            }
        }
    }
}
export { connectContainerInOuts };
//# sourceMappingURL=connect-container-in-outs.js.map