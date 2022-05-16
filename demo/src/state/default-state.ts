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
    minY                 : false,
    bezier_              : false,
    looseBoundingBox_    : false,
    tightBoundingBox_    : true,
    boundingHull_        : false,
    loop                 : false,
    loops                : false,
    intersection         : false,
    container            : false,
    loopPre              : false,
    loopsPre             : false,
}


const defaultDeduced: DeducedState = {
    path: ''
}

const defaultPageState: PageState = {
    deduced: defaultDeduced,
    showDelay: 1000,
    clickFor: 'bezier',
    toDraw: defaultToDraw,
    viewbox: [[0,0],[100.100]],
    vectorName : 'holy poly',
}


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
