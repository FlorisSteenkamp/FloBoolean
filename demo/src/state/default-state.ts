import { AppState } from './app-state.js';
// import { vectors } from './vectors.js';
import { TransientState } from './transient-state.js';
import { PageState } from './page-state.js';
import { createEmptyGeneratedSvgs } from './create-empty-generated-svgs.js';
import { IDebugElems } from '../../../src/debug/debug-elem-types.js';
import { DeducedState } from './deduced-state.js';


const defaultTransientState: TransientState = {
    current: {
        g: undefined,
    },
    viewboxStack: [],
    zoomState: {},
    $svgs: createEmptyGeneratedSvgs(),
    bezierLoopss: []
}


const defaultToDraw: { [T in keyof IDebugElems]: boolean } = {
    loopPre              : false,
    loopsPre             : false,
    loops                : true,
    minY                 : false,
    bezier_              : false,
    looseBoundingBox_    : false,
    tightBoundingBox_    : false,
    boundingHull_        : false,
    loop                 : true,
    intersection         : false,
    container            : false,
}


const defaultDeduced: DeducedState = {
    pathStrs: ['']
};

const defaultPageState: PageState = {
    deduced: defaultDeduced,
    showDelay: 2000,
    clickFor: 'bezier',
    toDraw: defaultToDraw,
    viewbox: [[0,0],[100,100]],
    vectorName : 'square',
    // vectorNameBoolean: 'two-squares',
    // forBoolean: true,
    booleanOp: 'AND'
};


const defaultAppState: AppState = {
    version: 2,
    pageState: defaultPageState
};


export { 
    defaultAppState, 
    defaultPageState, 
    defaultTransientState, 
    defaultDeduced 
}
