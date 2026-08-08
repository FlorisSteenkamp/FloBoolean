declare const _debug_: Debug; 
import type { Debug } from '../../debug/debug.js';
import type { Container } from "../container.js";
import type { Mutable } from '../../utils/mutable.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import { getBigBox } from '../get-big-box.js';
import { timeFunctionCalls } from '../../utils/time-function-call.js';


const assignBigBoxesToContainers = timeFunctionCalls(function assignBigBoxesToContainers(
        containers: Container[],
        expMax: number) {

    for (const container of containers) {
        const [[minX, minY], [maxX, maxY]] = container.box;
        const c = [(minX + maxX)/2, (minY + maxY)/2];
        
        const rects = [
            ...container.xs.map(x => x!.next!.container!.box),
            ...container.xs.map(x => x!.prev!.container!.box),
        ];
        
        const bigBox = getBigBox(expMax, rects, c);
        
        (container as Mutable<Container>).bigBox = bigBox;
    }
});


export { assignBigBoxesToContainers }
