import { State } from '../state/state.js';
import { Upd, UpdFunction } from './upd.js';
import { TransientState } from '../state/transient-state.js';


interface StateControl {
    /**
     * State that:
     * * is not stored to localstorage
     * * does not update react components
     */
    transientState: TransientState;
    /** 
     * State that: 
     * * is stored to local storage
     * * updates react components
     */
    state: State;
    /** Updates state and triggers react render */
    upd: UpdFunction;
    /** Updates state and *does not*  triggers react render */
    upd$: UpdFunction;
}


export { StateControl }
