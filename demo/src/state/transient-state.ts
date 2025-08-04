import { IDebugElems as DebugElems, Loop } from "../../../src/index";


interface TransientState {
    current: { g: SVGGElement | undefined };
    viewboxStack: number[][][];
    zoomState: Partial<{
            mouseIsDown: boolean;
            prevViewboxXY: number[];
            zoomRect: SVGRectElement;
    }>;
    $svgs: { [T in keyof DebugElems]: SVGElement[][] };
    bezierLoopss: Loop[][];
}


export { TransientState }
