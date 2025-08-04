import { PageState } from "./page-state";


/**
 * The App state
 */
interface AppState {
    /** The state version */
    version: number;
    pageState: PageState;
}


export { AppState }
