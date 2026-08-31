import { drawElemFunctions } from './draw-elem/draw-elem.js';
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 *
 * @param debug a (possibly undefined) debug object
 */
function enableDebugForBooleanOp(debugOn) {
    if (!debugOn) {
        globalThis._debug_ = undefined;
        return;
    }
    const debug = globalThis._debug_;
    const debug_ = {
        ...debug,
        // callCounts: {
        //     l1: 0,
        //     l2: 0,
        //     l3: 0,
        //     lil1: 0,
        //     lil2: 0,
        //     lil3: 0,
        //     lil4: 0
        // },
        elems: {
            ...debug?.elems,
            minY: [],
            loop: [],
            loopPre: [],
            loopsPre: [],
            loops: [],
            intersection: [],
            container: [],
            bezier_: [],
            looseBoundingBox_: [],
            tightBoundingBox_: [],
            boundingHull_: [],
        },
        timing: {
            ...debug?.timing,
            normalize: 0,
            simplifyPaths: 0,
        },
        fs: {
            ...debug?.fs,
            drawElem: {
                ...debug?.fs?.drawElem,
                ...drawElemFunctions
            }
        }
    };
    globalThis._debug_ = debug_;
}
export { enableDebugForBooleanOp };
//# sourceMappingURL=debug.js.map