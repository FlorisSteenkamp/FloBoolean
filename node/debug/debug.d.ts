import type { DebugElems } from './debug-elems.js';
import { DrawElemFunctions } from './draw-elem/draw-elem.js';
type GeneratedElems = {
    [T in keyof DebugElems]: DebugElems[T][];
};
interface Timing {
    readonly timingStart: number;
    readonly normalize: number;
    readonly simplifyPaths: number;
}
interface DebugFunctions {
    readonly drawElem: DrawElemFunctions;
}
interface Debug {
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
    };
}
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 *
 * @param debug a (possibly undefined) debug object
 */
declare function enableDebugForBooleanOp(debugOn: boolean): void;
export type { Debug, GeneratedElems, Timing, DebugFunctions };
export { enableDebugForBooleanOp };
