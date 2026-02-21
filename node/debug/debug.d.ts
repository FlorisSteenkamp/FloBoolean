import type { IDebugElems } from './debug-elem-types.js';
import { TDrawElemFunctions } from './draw-elem/draw-elem.js';
type GeneratedElems = {
    [T in keyof IDebugElems]: IDebugElems[T][];
};
interface ITiming {
    readonly normalize: number;
    simplifyPaths: number;
}
interface Generated {
    readonly elems: GeneratedElems;
    readonly timing: ITiming;
}
interface IDebugFunctions {
    readonly drawElem: TDrawElemFunctions;
}
interface Debug {
    readonly generated: Generated;
    readonly fs: IDebugFunctions;
    readonly verbose: boolean;
}
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debug a (possibly undefined) debug object
 */
declare function enableDebugForBooleanOp(debugOn: boolean): void;
export type { Debug, GeneratedElems, ITiming, Generated, IDebugFunctions };
export { enableDebugForBooleanOp };
