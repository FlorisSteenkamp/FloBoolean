import { drawElemFunctions } from './draw-elem/draw-elem';
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debug a (possibly undefined) debug object
 */
function enableDebugForBooleanOp(debugOn) {
    if (!debugOn) {
        window._debug_ = undefined;
        return;
    }
    const debug = window._debug_;
    const debug_ = {
        ...debug,
        generated: {
            ...(!debug ? {} : !debug.generated ? {} : debug.generated),
            elems: {
                ...(!debug ? {} : !debug.generated ? {} : !debug.generated.elems ? {} : debug.generated.elems),
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
                ...(!debug ? {} : !debug.generated ? {} : !debug.generated.timing ? {} : debug.generated.timing),
                normalize: 0,
                simplifyPaths: 0,
            }
        },
        fs: {
            ...(!debug ? {} : !debug.fs ? {} : debug.fs),
            drawElem: {
                ...(!debug ? {} : !debug.fs ? {} : !debug.fs.drawElem ? {} : debug.fs.drawElem),
                ...drawElemFunctions
            }
        }
    };
    window._debug_ = debug_;
}
export { enableDebugForBooleanOp };
//# sourceMappingURL=debug.js.map