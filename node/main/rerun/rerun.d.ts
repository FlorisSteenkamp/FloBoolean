import type { Container } from '../../containers/container.js';
import type { BezierPiece } from 'flo-bezier3';
import { OutSetInfo } from '../out-set.js';
/**
 * Rerun the paths after reversing `InOut`s whose orientation has been reversed.
 *
 * * creates cleaner (minimal) paths and ensures none of the output loops
 *   overlap which can happen when some bezier curves exactly overlaps
 *
 * * **modifies** `cotainers` and `InOut`s in-place instead of creating new
 *   ones
 *
 * @param expMax
 * @param outSets
 * @param containers
 * @param _loopss
 */
declare function rerun(expMax: number, outSets: OutSetInfo[][], containers: Container[], _loopss: BezierPiece[][][]): BezierPiece[][][];
export { rerun };
