import { State } from '../state/state';
import { Upd, UpdFunction } from './upd';
import { TransientState } from '../state/transient-state';


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
