declare const _debug_: Debug; 

import { Debug } from '../../../src/index.js';
import { StateControl } from "../state-control/state-control";
import { getViewBoxForShape } from './viewbox.js';


function gotoPrevViewbox(
        stateControl: StateControl) {

    const { transientState, state, upd } = stateControl;
    const { pageState } = state.appState;
    let viewbox = transientState.viewboxStack.pop();
    if (!viewbox) {

        const loops = _debug_.generated.elems.loop;
        const bezierLoops = loops.map(loop => loop.beziers);
        viewbox = getViewBoxForShape(bezierLoops);
    }

    upd(pageState, { viewbox });
}


export { gotoPrevViewbox }
