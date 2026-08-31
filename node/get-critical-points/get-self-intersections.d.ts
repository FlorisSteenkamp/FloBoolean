import type { X } from './x.js';
import type { Loop } from '../shape/loop.js';
/**
 * @param loops
 */
declare function getSelfIntersections(loops: Loop[]): [X, X][];
export { getSelfIntersections };
