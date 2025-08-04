import type { Loop } from './loop';
import type { IPointOnShape } from '../point-on-shape/point-on-shape';
/**
 * Returns the bounds of the given loop - used in tests only.
 */
declare const getLoopBounds: (a: Loop) => {
    minX: IPointOnShape;
    minY: IPointOnShape;
    maxX: IPointOnShape;
    maxY: IPointOnShape;
};
export { getLoopBounds };
