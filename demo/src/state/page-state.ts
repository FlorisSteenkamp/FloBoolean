import { ToDraw } from './to-draw';
import { DeducedState } from './deduced-state';


type ClickFor = 
    | 'minY'
    | 'bezier'
    | 'bezier_'
    | 'container'
    | 'loopPost'
    | 'loopsPost'
    | 'intersection'
    | 'looseBoundingBox_'
    | 'tightBoundingBox_'
    | 'boundingHull_'
    | 'loopPre'


type BooleanOp = 'AND' | 'OR' | 'XOR' | 'aNOTb';


interface PageState {
    /** Won't be save to localstorage */
    deduced: DeducedState | undefined;
    showDelay: number;
    clickFor: ClickFor;
    viewbox: number[][];
    toDraw: ToDraw;
    vectorName: string;
    vectorNameBoolean: string;
    forBoolean: boolean;
    booleanOp: BooleanOp;
}



export type { PageState, ClickFor, BooleanOp }
