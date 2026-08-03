import type { _X_ } from "../../../get-critical-points/-x-.js";
import type { Curve } from "../../../curve/curve.js";
import type { In, Out } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
/**
 * * **warning** modifies container.xs[i].in_
 *
 * @param container
 */
declare function getXInOuts(container: Container): (curve: Curve, xs_: _X_[]) => {
    ins: In[];
    outs: Out[];
};
export { getXInOuts };
