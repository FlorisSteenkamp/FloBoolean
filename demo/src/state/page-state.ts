import { ToDraw } from './to-draw.js';
import { DeducedState } from './deduced-state.js';


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


interface PageState {
    /** Won't be save to localstorage */
    deduced    : DeducedState | undefined;
    showDelay  : number;
    clickFor   : ClickFor;
    viewbox    : number[][];
    toDraw     : ToDraw;
    vectorName: string;
}



export { PageState, ClickFor }
