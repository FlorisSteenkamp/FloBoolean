import type { DebugElems } from './debug-elem-types.js';
import { drawElemFunctions, TDrawElemFunctions } from './draw-elem/draw-elem.js';


type GeneratedElems = { [T in keyof DebugElems]: DebugElems[T][] };


interface Timing {
    readonly timingStart: number;
    readonly normalize: number;
    readonly simplifyPaths : number;
}


interface DebugFunctions {
    readonly drawElem: TDrawElemFunctions,
}


interface Debug {
    /* Generated elements for later inspection */
    readonly elems: GeneratedElems;
    readonly timing: Timing;
    readonly fs: DebugFunctions;
    readonly verbose: boolean;
}


/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * 
 * @param debug a (possibly undefined) debug object
 */
function enableDebugForBooleanOp(
        debugOn: boolean) {

    if (!debugOn) { 
        (globalThis as any)._debug_ = undefined; 
        return;
    }

    const debug: Debug = (globalThis as any)._debug_;

    const debug_: Debug = { 
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

    (globalThis as any)._debug_ = debug_;
}   


export type { 
    Debug,
    GeneratedElems, 
    Timing, 
    DebugFunctions
}


export { enableDebugForBooleanOp }
