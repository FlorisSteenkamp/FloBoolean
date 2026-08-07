import type { ToDraw } from './to-draw.js';
import type { DeducedState } from './deduced-state.js';
import { ClickFor } from './click-for.js';


// FUTURE
// type BooleanOp = 'AND' | 'OR' | 'XOR' | 'aNOTb';
type BooleanOp = 'AND' | 'OR' | 'XOR';


interface PageState {
    /** Won't be save to localstorage */
    readonly deduced: DeducedState | undefined;
    readonly showDelay: number;
    readonly clickFor: ClickFor;
    readonly viewbox: number[][];
    readonly toDraw: ToDraw;
    readonly vectorName: string;
    // readonly vectorNameBoolean: string;
    // readonly forBoolean: boolean;
    readonly booleanOp: BooleanOp;
}



export type { PageState, BooleanOp }
