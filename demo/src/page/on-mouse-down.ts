import { StateControl } from "../state-control/state-control.js";
import { getViewboxXY } from "./get-viewbox-xy.js";


function onMouseDown(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>) {

    return (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (event.shiftKey || event.ctrlKey || event.altKey) { return; }
        
        const svg$ = ref.current;
        if (!svg$) { return; }
        
        const ox = event.nativeEvent.offsetX;
        const oy = event.nativeEvent.offsetY;
        const viewboxXY = getViewboxXY(svg$, stateControl.state.appState.pageState.viewbox, ox, oy);

        const { transientState } = stateControl;
        const { zoomState } = transientState;

        // Just make sure previous rect is removed
        if (zoomState.zoomRect) { zoomState.zoomRect.remove(); }

        transientState.zoomState = { 
            mouseIsDown: true,
            prevViewboxXY: viewboxXY,
            zoomRect: undefined
        };
    }
}


export { onMouseDown }
