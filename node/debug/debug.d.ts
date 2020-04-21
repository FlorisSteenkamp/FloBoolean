import { TDrawElemFunctions } from './draw-elem/draw-elem';
import { IDebugElems } from './debug-elem-types';
declare type GeneratedElems = {
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
export { Debug, GeneratedElems, ITiming, Generated, IDebugFunctions, enableDebugForBooleanOp };
