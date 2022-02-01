import { getBounds } from "flo-bezier3";
import { memoize } from "flo-memoize";

const getBounds_ = memoize(getBounds);


export { getBounds_ }
