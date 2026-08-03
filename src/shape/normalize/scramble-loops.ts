import { bitLength } from 'big-float-ts';
import { toGrid } from './to-grid.js';


/**
 * For testing purposes only - not used in the actual algorithm
 * 
 * * use as `loops = scrambleLoops(loops, maxBitLength, expMax, 1)`
 */
function scrambleLoops(
        loops: number[][][][], 
        maxBitLength: number, 
        expMax: number,
        mult = 0.02) {

    const loops_: number[][][][] = [];
    for (const loop of loops) {
        const loop_: number[][][] = [];
        for (const bez of loop) {
            const bez_ = bez.map(v => v.map(c => {
                let c_ = 0;
                let ii = 0;
                let mblc: number;
                let mbl = 0;
                while (true) {
                    if (++ii > 10) { break; }
                    c_ = (c + Math.random()) * (1 + ((Math.random()-0.7) * mult));
                    c_ = toGrid(c_, expMax, maxBitLength);
                    const bl = bitLength(c_);
                    if (bl > mbl) {
                        mbl = bl;
                        mblc = c_;
                    }
                }
                return mblc!;
            }));
            loop_.push(bez_);
        }
        loops_.push(loop_);
    }

    return loops_;
}


export { scrambleLoops }
