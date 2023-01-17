import type { IDebugElems } from './debug-elem-types.js';
import { TDrawElemFunctions } from './draw-elem/draw-elem.js';
type GeneratedElems = {
    [T in keyof IDebugElems]: IDebugElems[T][];
};
interface ITiming {
    normalize: number;
    simplifyPaths: number;
}
interface Generated {
    elems: GeneratedElems;
    timing: ITiming;
}
interface IDebugFunctions {
    drawElem: TDrawElemFunctions;
}
interface Debug {
    generated: Generated;
    fs: IDebugFunctions;
}
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debug a (possibly undefined) debug object
 */
declare function enableDebugForBooleanOp(debugOn: boolean): void;
export type { Debug, GeneratedElems, ITiming, Generated, IDebugFunctions };
export { enableDebugForBooleanOp };
