import { Container } from "../../../container.js";
import { _X_ } from "../../../-x-.js";
import { Curve } from "../../../curve/curve.js";
import { OrderedInOut } from "./ordered-in-out.js";
/**
 * * **warning** modifies container.xs[i].in_
 * @param container
 */
declare function getXInOuts(container: Container): (curve: Curve, xs_: _X_[], ioIdx: number) => {
    ins: OrderedInOut[];
    outs: OrderedInOut[];
    ioIdx: number;
};
export { getXInOuts };
