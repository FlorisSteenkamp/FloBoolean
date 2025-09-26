declare const _debug_: Debug; 

import { Debug, IDebugElems } from '../../../src/index.js';
import { StateControl } from '../state-control/state-control.js';
import { ToDraw } from '../state/to-draw.js';
import { deleteSvgs } from './delete-svgs.js';


async function drawElements(
        stateControl: StateControl,
        ref: React.RefObject<SVGSVGElement | null>,
        toDraws: ToDraw) {

    if (typeof _debug_ === 'undefined') { return; }

    const { transientState } = stateControl;
    const { $svgs } = transientState;

    const svg$ = ref.current!;
    const g = svg$.getElementsByTagName('g')[0];

    const elemss$: SVGElement[][][] = [];
    for (const elemType_ in toDraws) {
        const elemType = elemType_ as keyof IDebugElems;

        const toDraw = toDraws[elemType];

        const $elems = $svgs[elemType];
        deleteSvgs($elems);
    
        if (!toDraw) { continue; }

        const generated = _debug_.generated;
        
        if (generated.elems[elemType] === undefined) { 
            continue; 
        }
        
        for (const elem of generated.elems[elemType]) {
            // console.log(elemType);
            const drawElem = _debug_.fs.drawElem[elemType] as (g: SVGGElement, elem: any) => SVGElement[];
            $elems.push(drawElem(g, elem));
        }
        
        elemss$.push($elems);
    }
    
    return elemss$;
}


export { drawElements }
