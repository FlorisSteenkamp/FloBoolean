import type { DebugElems } from './debug-elem-types.js';
import { TDrawElemFunctions } from './draw-elem/draw-elem.js';
type GeneratedElems = {
    [T in keyof DebugElems]: DebugElems[T][];
};
interface Timing {
    readonly timingStart: number;
    readonly normalize: number;
    readonly simplifyPaths: number;
}
interface DebugFunctions {
    readonly drawElem: TDrawElemFunctions;
}
interface Debug {
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
declare function enableDebugForBooleanOp(debugOn: boolean): void;
export type { Debug, GeneratedElems, Timing, DebugFunctions };
export { enableDebugForBooleanOp };
