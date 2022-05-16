import { IDebugElems } from '../debug-elem-types.js';
declare type TDrawElemFunctions = {
    [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T], classes?: string, delay?: number) => SVGElement[];
};
declare const drawElemFunctions: TDrawElemFunctions;
export { drawElemFunctions, TDrawElemFunctions };
