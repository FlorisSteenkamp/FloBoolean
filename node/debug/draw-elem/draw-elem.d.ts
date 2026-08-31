import type { DebugElems } from '../debug-elems.js';
type DrawElemFunctions = {
    [T in keyof DebugElems]: (g: SVGGElement, elem: DebugElems[T], classes?: string, delay?: number) => SVGElement[];
};
declare const drawElemFunctions: DrawElemFunctions;
export { drawElemFunctions, DrawElemFunctions };
