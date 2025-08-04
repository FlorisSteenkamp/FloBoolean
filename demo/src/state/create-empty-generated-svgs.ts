import { IDebugElems } from "../../../src/debug/debug-elem-types";


function createEmptyGeneratedSvgs(): { [T in keyof IDebugElems]: SVGElement[][] }  {
    return {
        bezier_              : [],
        looseBoundingBox_    : [],
        tightBoundingBox_    : [],
        boundingHull_        : [],
        minY                 : [],
        loop                 : [],
        loopPre              : [],
        loopsPre             : [],
        loops                : [],
        intersection         : [],
        container            : [],
    };
}


export { createEmptyGeneratedSvgs }
