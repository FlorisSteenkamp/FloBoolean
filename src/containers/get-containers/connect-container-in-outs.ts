import type { Container } from "../container.js";
import type { Mutable } from "../../utils/mutable.js";
import type { InOut } from "../in-out/in-out.js";


/**
 * * modifies `containers`
 */
function connectContainerInOuts(
        containers: Container[]) {

    for (const container of containers) {
        for (const inOut of container.inOuts) {
            if (inOut.dir === -1) { continue; }

            const out = inOut;
            let _x_ = out._x_!;
            // move to next 'in' __X__
            while (true) {
                _x_ = _x_.next!;
                if (_x_.in_ !== undefined) { 
                    break;
                }
            }
            (out as Mutable<InOut>).nextOrPrev = _x_.in_;
            (out as Mutable<InOut>).idx = out.nextOrPrev!.idx;
        }
    }

    for (const container of containers) {
        for (const inOut of container.inOuts) {
            if (inOut.dir === +1) { continue; }

            const in_ = inOut;
            let _x_ = in_._x_!;
            // move to prev 'out' __X__
            while (true) {
                _x_ = _x_.prev!;
                if (_x_.out !== undefined) { 
                    break;
                }
            }
            (in_ as Mutable<InOut>).nextOrPrev = _x_.out;
            (in_ as Mutable<InOut>).idx = in_.nextOrPrev!.idx;
        }
    }
}


export { connectContainerInOuts }
