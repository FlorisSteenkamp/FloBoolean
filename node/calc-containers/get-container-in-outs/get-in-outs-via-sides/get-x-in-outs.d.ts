import { Container } from "../../../container.js";
import { __X__ } from "../../../-x-.js";
import { Curve } from "../../../curve/curve.js";
import { InOut } from "../../../in-out.js";
/**
 * * **warning** modifies container.xs[i].in_
 * @param container
 */
declare function getXInOuts(container: Container): (curve: Curve, xs_: __X__[], ioIdx: number) => {
    ins: InOut[];
    outs: InOut[];
    ioIdx: number;
};
export { getXInOuts };
