import type { Container } from "../container.js";
import type { Mutable } from "../../utils/mutable.js";
import type { In, Out } from "../in-out/in-out.js";


/**
 * * modifies `containers`
 */
function connectContainerInOuts(
        containers: Container[]) {

    for (const container of containers) {
        for (const inOut of container.inOuts) {
            if (inOut.dir === -1) { continue; }

            const out = inOut as Mutable<Out>;
            let _x_ = out._x_;
            // move to next 'in' _X_
            while (true) {
                _x_ = _x_.next!;
                if (_x_.in_ !== undefined) { 
                    break;
                }
            }
            out.nextOrPrev = _x_.in_;
            out.idx = out.nextOrPrev!.idx;
        }
    }

    for (const container of containers) {
        for (const inOut of container.inOuts) {
            if (inOut.dir === +1) { continue; }

            const in_ = inOut as Mutable<In>;
            let _x_ = in_._x_;
            // move to prev 'out' _X_
            while (true) {
                _x_ = _x_.prev!;
                if (_x_.out !== undefined) { 
                    break;
                }
            }
            in_.nextOrPrev = _x_.out;
            in_.idx = in_.nextOrPrev!.idx;
        }
    }
}


export { connectContainerInOuts }
