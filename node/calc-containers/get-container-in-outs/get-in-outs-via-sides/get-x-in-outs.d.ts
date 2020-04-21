import { Container } from "../../../container";
import { _X_ } from "../../../x";
import { Curve } from "../../../curve/curve";
import { OrderedInOut } from "./ordered-in-out";
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
