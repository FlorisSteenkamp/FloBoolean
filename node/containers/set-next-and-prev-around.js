function setNextAndPrevAround(inOuts) {
    let prevInOut = inOuts[inOuts.length - 1];
    for (let i = 0; i < inOuts.length; i++) {
        const inOut = inOuts[i];
        inOut.prevAround = prevInOut;
        prevInOut.nextAround = inOut;
        prevInOut = inOut;
    }
}
export { setNextAndPrevAround };
//# sourceMappingURL=set-next-and-prev-around.js.map