import { DebugElems } from "../../../src/debug/debug-elems.js";


function createEmptyGeneratedSvgs(): { [T in keyof DebugElems]: SVGElement[][] }  {
    return {
        bezier_          : [],
        looseBoundingBox_: [],
        tightBoundingBox_: [],
        boundingHull_    : [],
        minY             : [],
        loop             : [],
        loopPre          : [],
        loopsPre         : [],
        loops            : [],
        intersection     : [],
        container        : [],
    };
}


export { createEmptyGeneratedSvgs }
