import type { StateControl } from "../state-control/state-control";
import { drawRect } from "./draw-rect";
import { getViewboxXY } from "./get-viewbox-xy";


function onMouseMove(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>,
        refX: React.RefObject<HTMLSpanElement | null>,
        refY: React.RefObject<HTMLSpanElement | null>) {

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
        if (spanX) { spanX.innerHTML = viewboxX.toFixed(2); }
        const spanY = refY.current;
        if (spanY) { spanY.innerHTML = viewboxY.toFixed(2); }

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
