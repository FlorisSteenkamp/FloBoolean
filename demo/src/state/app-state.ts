import type { PageState } from "./page-state.js";


/**
 * The App state
 */
interface AppState {
    /** The state version */
    readonly version: number;
    readonly pageState: PageState;
}


export type { AppState }
