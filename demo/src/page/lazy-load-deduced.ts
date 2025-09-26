import { StateControl } from "../state-control/state-control";
import { PageState } from "../state/page-state";
import { drawElements } from "./draw-elements";
import { loadDeducedProps } from "./load-deduced-props";
import { loadPaths } from "./load-paths";


async function lazyLoadDeduced(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>,
        changeViewbox: boolean,
        forBoolean: boolean) {

    const { upd, state } = stateControl;
    const { toDraw } = state.appState.pageState;

    const { pageState } = stateControl.state.appState;
    const { vectorName, vectorNameBoolean } = pageState;

    const pathStrs = await loadPaths(forBoolean ? vectorNameBoolean : vectorName, forBoolean);

    upd(stateControl.state.appState.pageState.deduced!, { pathStrs });

    const { viewbox, timingAll } = await loadDeducedProps(stateControl, pathStrs, forBoolean);

    console.log(`All took: ${timingAll.toFixed(0)} milliseconds.`);

    const elems$ = drawElements(stateControl, ref, toDraw);

    upd(stateControl.state.appState.pageState, {
        ...(changeViewbox ? { viewbox } : {}),
        deduced: { pathStrs }
    });
}


export { lazyLoadDeduced }
