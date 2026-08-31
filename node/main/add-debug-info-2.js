function addDebugInfo2(loopss) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    for (const loops of loopss) {
        _debug_.elems.loop.push(...loops);
        _debug_.elems.loops.push(loops);
    }
    if (typeof _debug_ !== 'undefined') {
        _debug_.timing.simplifyPaths =
            performance.now() - _debug_.timing.timingStart - _debug_.timing.normalize;
    }
    // ---------------------------------------------------------------------
    // Don't delete below commented lines - it is for creating test cases.
    // if (typeof document === 'undefined') { return; }
    // let g = document.getElementsByTagName('g')[0];
    // let invariants = loopss.map(loops => {
    //    return loops.map(loop => {
    //        let centroid = getShapeCentroid(loop.beziers);
    //        let area     = -getShapeArea(loop.beziers);
    //        let bounds   = getShapeBounds(loop.beziers);
    //        //drawFs.crossHair(g, centroid, 'thin10 red nofill', 1, 0);
    //        return { centroid, area, bounds };
    //    });
    // });
    // console.log(JSON.stringify(invariants, undefined, '    '));
    // ---------------------------------------------------------------------
}
export { addDebugInfo2 };
//# sourceMappingURL=add-debug-info-2.js.map