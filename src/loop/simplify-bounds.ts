import type { IPointOnShape } from "../point-on-shape/point-on-shape.js";


/** Used in tests only - not used in algorithm */
function simplifyBounds(
        bounds: {
            minX: IPointOnShape;
            minY: IPointOnShape;
            maxX: IPointOnShape;
            maxY: IPointOnShape;
        }) {

    return {
        minX: bounds.minX.p[0],
        minY: bounds.minY.p[1],
        maxX: bounds.maxX.p[0],
        maxY: bounds.maxY.p[1],
    };
}


export { simplifyBounds }
