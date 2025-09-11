
function reverseShapeOrientation(pss: number[][][]) {
    return pss.map(ps => ps.toReversed()).toReversed();
}


export { reverseShapeOrientation }
