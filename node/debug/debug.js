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
                ...debug?.fs.drawElem,
                ...drawElemFunctions
            }
        }
    };
    globalThis._debug_ = debug_;
}
export { enableDebugForBooleanOp };
//# sourceMappingURL=debug.js.map