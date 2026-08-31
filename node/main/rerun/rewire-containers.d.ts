import type { Container } from '../../containers/container.js';
import type { BezierPiece } from 'flo-bezier3';
import type { OutSetInfo } from '../out-set.js';
declare function rewireContainers(containers: Container[], outSets: OutSetInfo[][], _loopss: BezierPiece[][][]): {
    containers_: Container[];
    minYContainers: Container[];
};
export { rewireContainers };
