import { logNearestContainer } from './log-nearest-container.js';
import { logNearestBezierPre, logLooseBb_, logTightBb_, logBHull_ } from './log-bbs.js';
import { logNearestBezierPost } from './log-nearest-bezier-post.js';
import { logNearestLoopsPost } from './log-nearest-loops-post.js';
import { logNearestLoopPost } from './log-nearest-loop-post.js';
import { logNearestLoopPre } from './log-nearest-loop-pre.js'
import { gotoPrevViewbox } from './goto-prev-viewbox.js';
import { StateControl } from '../state-control/state-control.js';
import { ClickFor } from '../state/page-state.js';
import { getViewboxXY } from './get-viewbox-xy.js';


function onClick(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>) {

    return (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (event.shiftKey) { 
            gotoPrevViewbox(stateControl);
            return;
        }

        const { state } = stateControl;
        const { pageState } = state.appState;
        const { clickFor, showDelay } = pageState;
        
        const svg$ = ref.current;
        if (!svg$) { return; }
        const g = svg$.getElementsByTagName('g')[0];

        // Pixel coordinates
        const ox = event.nativeEvent.offsetX;
        const oy = event.nativeEvent.offsetY;

        // SVG actual coordinates
        const viewboxXY = getViewboxXY(svg$, pageState.viewbox, ox, oy);
        const [x,y] = viewboxXY;

        const fs: { [T in ClickFor]: ((g: SVGGElement, p: number[], delay: number) => void) | undefined } = {
            bezier_           : logNearestBezierPre,
            loopPre           : logNearestLoopPre,

            bezier            : logNearestBezierPost,
            loopPost          : logNearestLoopPost,
            loopsPost         : logNearestLoopsPost,

            minY: undefined!,
            container         : logNearestContainer,
            // loops: undefined!,
            intersection      : undefined,
            
            looseBoundingBox_ : logLooseBb_,
            tightBoundingBox_ : logTightBb_,
            boundingHull_     : logBHull_,
            // loopset           : logNearestLoopSet,
            
        }

        const f = fs[clickFor];

        if (f === undefined) { return; }

        f(g, [x,y], showDelay);
    }
}


export { onClick }
