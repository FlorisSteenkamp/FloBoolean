import { StateControl } from "../state-control/state-control.js";
import { PageState } from "../state/page-state.js";
import { drawElements } from "./draw-elements.js";
import { loadDeducedProps } from "./load-deduced-props.js";
import { loadPaths } from "./load-paths.js";


async function lazyLoadDeduced(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>,
        changeViewbox: boolean,
        // forBoolean: boolean) {
        ) {

    const { upd, state } = stateControl;
    const { toDraw } = state.appState.pageState;

    const { pageState } = stateControl.state.appState;
    // const { vectorName, vectorNameBoolean } = pageState;
    const { vectorName } = pageState;

    // const pathStrs = await loadPaths(forBoolean ? vectorNameBoolean : vectorName, forBoolean);
    const pathStrs = await loadPaths(vectorName);

    upd(stateControl.state.appState.pageState.deduced!, { pathStrs });

    // const { viewbox, timingAll } = await loadDeducedProps(stateControl, pathStrs, forBoolean);
    const { viewbox, timingAll } = await loadDeducedProps(stateControl, pathStrs);

    console.log(`All took: ${timingAll.toFixed(0)} milliseconds.`);

    const elems$ = drawElements(stateControl, ref, toDraw);

    upd(stateControl.state.appState.pageState, {
        ...(changeViewbox ? { viewbox } : {}),
        deduced: { pathStrs }
    });
}


export { lazyLoadDeduced }
