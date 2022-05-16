import { State } from "../state/state.js";
import { AppState } from "../state/app-state.js";
import { _updObj } from "./upd-obj.js";
import { NestedObj } from './nested-obj.js';


type UpdFunction = <T extends NestedObj>(v: T, newV: Partial<T>) => T;

interface Upd {
    upd: UpdFunction;
    upd$: UpdFunction;
}


function _upd(
        state: State,
        setState: React.Dispatch<React.SetStateAction<AppState>>) {

    let map: Map<any,string[]> = new Map();
    let weakMap: WeakMap<any,string[]> = new WeakMap();
    let updObj = _updObj(state, map, weakMap);

    /** 
     * @param triggerUpdate If true, then triggers a react and localstorage 
     * update
     */
    function _upd<T extends NestedObj>(triggerUpdate: boolean) {
        return(v: T, newV: Partial<T>) => {

            let { appState, newV_ } = updObj(v,newV);
            state.appState = appState;

            if (triggerUpdate) {
                setState(appState);
                toLocalStorage(appState);
            }

            return newV_;
        }
    }

    /** 
     * Updates state and triggers react render 
     */
    const upd = _upd(true);
    /** 
     * Updates state and *does not* trigger react render 
     */
    const upd$ = _upd(false);

    return { upd, upd$ };
}


function toLocalStorage(appState: AppState) {
    // omit transient (lazy loaded, etc) properties from state
    let appState_: AppState = { 
        ...appState,
        pageState: {
            ...appState.pageState,
            deduced: undefined
        }
    };
    localStorage.setItem(
        'app-state', 
        JSON.stringify(appState_)
    );
}


export { _upd, Upd, UpdFunction }
