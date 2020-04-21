
import { drawElemFunctions, TDrawElemFunctions } from './draw-elem/draw-elem';
import { IDebugElems } from './debug-elem-types';


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

    let debug: Debug = (window as any)._debug_;

    debug = { 
        ...debug, 
        generated: { 
            ...debug?.generated,
            elems: { 
                ...debug?.generated?.elems,
                minY         : [],
                loop         : [],
                loops        : [],
                intersection : [],
                container    : [],
                bezier_      : [],
                looseBoundingBox_ : [],
                tightBoundingBox_ : [],
                boundingHull_     : []
            },
            timing: {
                ...debug?.generated?.timing,
                normalize     : 0,
                simplifyPaths : 0,
            }
        },
        fs: {
            ...debug?.fs,
            drawElem: {
                ...debug?.fs?.drawElem,
                ...drawElemFunctions
            }
        }
    };

    (window as any)._debug_ = debug;
}   


export { 
    Debug,
    GeneratedElems, 
    ITiming, 
    Generated, 
    IDebugFunctions,
    enableDebugForBooleanOp
}
