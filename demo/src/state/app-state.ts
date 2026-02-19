import { PageState } from "./page-state";


/**
 * The App state
 */
interface AppState {
    /** The state version */
    readonly version: number;
    readonly pageState: PageState;
}


export { AppState }
