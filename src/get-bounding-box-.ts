import { getBoundingBox } from "flo-bezier3";
import { memoize } from "flo-memoize";

const getBoundingBox_ = memoize(getBoundingBox);


export { getBoundingBox_ }
