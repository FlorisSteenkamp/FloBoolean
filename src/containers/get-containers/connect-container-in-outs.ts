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
            if (inOut.dir === +1) {
                const out = inOut as Mutable<Out>;
                let { _x_ } = out;
                _x_ = _x_.next!;
                out.twin = _x_.in_!;
                out.idx = out.twin!.idx;
            } else {
                const in_ = inOut as Mutable<In>;
                let { _x_ } = in_;
                _x_ = _x_.prev!;
                in_.twin = _x_.out!;
                in_.idx = in_.twin!.idx;
            }
        }
    }
}


export { connectContainerInOuts }
