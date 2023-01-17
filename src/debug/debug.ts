import type { IDebugElems } from './debug-elem-types.js';
import { drawElemFunctions, TDrawElemFunctions } from './draw-elem/draw-elem.js';


type GeneratedElems = { [T in keyof IDebugElems]: IDebugElems[T][] };


interface ITiming {
    normalize     : number;
    simplifyPaths : number;
}


interface Generated {
    elems: GeneratedElems;
    timing: ITiming;
}


interface IDebugFunctions {
    drawElem : TDrawElemFunctions,
}


interface Debug {
    /* Generated elements for later inspection */
    generated: Generated;
    fs: IDebugFunctions;
}


/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debug a (possibly undefined) debug object
 */
function enableDebugForBooleanOp(debugOn: boolean) {
    if (!debugOn) { 
        (window as any)._debug_ = undefined; 
        return;
    }

    const debug: Debug = (window as any)._debug_;

    const debug_ = { 
        ...debug,
        generated: { 
            ...(!debug ? {} : !debug.generated ? {} : debug.generated),
            elems: { 
                ...(!debug ? {} : !debug.generated ? {} : !debug.generated.elems ? {} : debug.generated.elems),
                minY         : [],
                loop         : [],
                loopPre      : [],
                loopsPre     : [],
                loops        : [],
                intersection : [],
                container    : [],
                bezier_      : [],
                looseBoundingBox_ : [],
                tightBoundingBox_ : [],
                boundingHull_     : [],
            },
            timing: {
                ...(!debug ? {} : !debug.generated ? {} : !debug.generated.timing ? {} : debug.generated.timing),
                normalize     : 0,
                simplifyPaths : 0,
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

    (window as any)._debug_ = debug_;
}   


export type { 
    Debug,
    GeneratedElems, 
    ITiming, 
    Generated, 
    IDebugFunctions
}


export { enableDebugForBooleanOp }
