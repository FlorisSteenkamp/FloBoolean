import type { Loop } from '../shape/loop.ts';


function loopToStringifyable(
        loop: Loop) {
    
    return {
        beziers: loop.beziers,
        idx: loop.idx
    }
}


export { loopToStringifyable }
