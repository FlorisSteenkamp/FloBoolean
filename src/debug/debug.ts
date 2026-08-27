import type { DebugElems } from './debug-elems.js';
import { drawElemFunctions, DrawElemFunctions } from './draw-elem/draw-elem.js';


type GeneratedElems = { [T in keyof DebugElems]: DebugElems[T][] };


interface Timing {
    readonly timingStart: number;
    readonly normalize: number;
    readonly simplifyPaths : number;
}


interface DebugFunctions {
    readonly drawElem: DrawElemFunctions,
}


interface Debug {
    /* Generated elements for later inspection */
    readonly elems: GeneratedElems;
    readonly timing: Timing;
    readonly fs: DebugFunctions;
    readonly verbose: boolean;
    readonly callCounts: {
        l1: number;
        l2: number;
        l3: number;
        lil1: number;
        lil2: number;
        lil3: number;
        lil4: number;
    }
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
        callCounts: {
            l1: 0,
            l2: 0,
            l3: 0,
            lil1: 0,
            lil2: 0,
            lil3: 0,
            lil4: 0
        },
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

    (globalThis as any)._debug_ = debug_;
}   


export type { 
    Debug,
    GeneratedElems, 
    Timing, 
    DebugFunctions
}


export { enableDebugForBooleanOp }
