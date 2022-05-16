import { PageState } from "./page-state.js";


/**
 * The App state
 */
interface AppState {
    /** The state version */
    version: number;
    pageState: PageState;
}


export { AppState }
