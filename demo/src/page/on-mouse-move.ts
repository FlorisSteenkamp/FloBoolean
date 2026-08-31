import type { StateControl } from "../state-control/state-control.js";
import { getPathsFromStr } from "../../../src/index.js";
import { drawRect } from "./draw-rect.js";
import { getViewboxXY } from "./get-viewbox-xy.js";
import { FLATTEN_SEGMENTS, flattenLoop, windingAt } from "./winding.js";


// Flattened directed edges of the current shape, cached by path string so the
// (relatively expensive) flattening only reruns when the displayed shape changes.
let cachedPathStr: string | undefined;
let cachedSegs: number[][] = [];

function getSegs(pathStr: string): number[][] {
    if (pathStr !== cachedPathStr) {
        const segs: number[][] = [];
        for (const loop of getPathsFromStr(pathStr)) {
            flattenLoop(FLATTEN_SEGMENTS, loop, segs);
        }
        cachedPathStr = pathStr;
        cachedSegs = segs;
    }
    return cachedSegs;
}


function onMouseMove(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>,
        refX: React.RefObject<HTMLSpanElement | null>,
        refY: React.RefObject<HTMLSpanElement | null>,
        refWinding: React.RefObject<HTMLSpanElement | null>) {

    return (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svg$ = ref.current;
        if (!svg$) { return; }

        const { state, transientState } = stateControl;
        const { pageState } = state.appState;
        const { zoomState } = transientState;

        // Pixel coordinates
        const pixelsX = event.nativeEvent.offsetX;
        const pixelsY = event.nativeEvent.offsetY;
        
        const [viewboxX,viewboxY] = 
            getViewboxXY(svg$, pageState.viewbox, pixelsX, pixelsY);

        const spanX = refX.current;
        if (spanX) { spanX.innerHTML = viewboxX.toFixed(3); }
        const spanY = refY.current;
        if (spanY) { spanY.innerHTML = viewboxY.toFixed(3); }

        const spanWinding = refWinding.current;
        if (spanWinding) {
            const pathStr = pageState.deduced?.pathStrs[0];
            const winding = pathStr
                ? windingAt(getSegs(pathStr), viewboxX, viewboxY)
                : 0;
            spanWinding.innerHTML = `w: ${winding}`;
        }

        if (!zoomState.mouseIsDown) { return; }

        if (zoomState.zoomRect) { zoomState.zoomRect.remove(); }
        const prevViewboxXY = zoomState.prevViewboxXY!;

        const newZoomRect = [
            prevViewboxXY, 
            [viewboxX, viewboxY]
        ];

        const g$ = svg$.getElementsByTagName('g')[0];
        zoomState.zoomRect = drawRect(g$, newZoomRect);

        //setXY({x,y});
    }
}


export { onMouseMove }
