function addDebugInfo2(loopss) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    for (const loops of loopss) {
        _debug_.generated.elems.loop.push(...loops);
        _debug_.generated.elems.loops.push(loops);
        //console.log(loopsToSvgPathStr(loops.map(loop => loop.beziers)));
    }
    // ---------------------------------------------------------------------
    // Don't delete below commented lines - it is for creating test cases.
    // if (typeof document === 'undefined') { return; }
    // let g = document.getElementsByTagName('g')[0];
    // let invariants = loopss.map(loops => {
    //    return loops.map(loop => {
    //        let centroid = getShapeCentroid(loop.beziers);
    //        let area     = getShapeArea(loop.beziers);
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