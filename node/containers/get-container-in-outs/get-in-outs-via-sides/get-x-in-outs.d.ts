import type { __X__ } from "../../../get-critical-points/-x-.js";
import type { Curve } from "../../../curve/curve.js";
import type { InOut } from "../../../containers/in-out/in-out.js";
import type { Container } from "../../container.js";
/**
 * * **warning** modifies container.xs[i].in_
 *
 * @param container
 */
declare function getXInOuts(container: Container): (curve: Curve, xs_: __X__[]) => {
    ins: InOut[];
    outs: InOut[];
};
export { getXInOuts };
