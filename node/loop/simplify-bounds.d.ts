import type { IPointOnShape } from "../point-on-shape/point-on-shape.js";
/** Used in tests only - not used in algorithm */
declare function simplifyBounds(bounds: {
    minX: IPointOnShape;
    minY: IPointOnShape;
    maxX: IPointOnShape;
    maxY: IPointOnShape;
}): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
export { simplifyBounds };
