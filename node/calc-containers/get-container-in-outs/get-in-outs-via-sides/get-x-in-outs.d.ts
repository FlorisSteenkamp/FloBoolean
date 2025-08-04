import { Container } from "../../../container";
import { __X__ } from "../../../-x-";
import { Curve } from "../../../curve/curve";
import { InOut } from "../../../in-out";
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
