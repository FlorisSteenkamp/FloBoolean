import type { Mutable } from '../../utils/mutable.js';
import type { _X_ } from '../../get-critical-points/-x-.js';
import type { In, Out } from '../../containers/in-out/in-out.js';
import type { Container } from '../../containers/container.js';
import type { BezierPiece } from 'flo-bezier3';
import type { OutSetInfo } from '../out-set.js';
import { setNextAndPrevAround } from '../../containers/set-next-and-prev-around.js';
import { compareInOut } from '../../containers/get-container-in-outs/get-in-outs-via-sides/compare-in-out.js';
import { getOrCreateRerunContainer } from './get-or-creatre-rerun-container.js';
import { rebuildInOut } from './rebuild-in-out.js';
import { bezierPiecesToBeziers$ } from '../../is-loop-in-loop/is-loop-in-loop.js';

const { sign } = Math;


function rewireContainers(
        containers: Container[],
        outSets: OutSetInfo[][],
        _loopss: BezierPiece[][][]) {

    containers.forEach((container, idx) => (container as Mutable<Container>).idx = idx);

    /** a sparse container array */ 
    const containers_: Container[] = [];
    const containersPerPath: Set<Container>[] = [];

    for (let i=0; i<outSets.length; i++) {   // an outer loop with holes
        const outSet = outSets[i];
        // Orientation the outer loop already has; holes must alternate against it.
        const outerOrientation = sign(outSet[0].windingNum - outSet[0].parentWinding);

        // const paths: Out[][] = [];  // For debug only
        for (let j=0; j<outSet.length; j++) {
            const outSetInf = outSet[j];
            const { out, depth, windingNum, parentWinding } = outSetInf;

            // A hole must wind opposite to its parent (islands opposite to holes,
            // ...); only reverse a loop whose current orientation doesn't already
            // match that depth alternation.
            const orientation = sign(windingNum - parentWinding);
            const desiredOrientation = (depth%2 === 0 ? 1 : -1) * outerOrientation;
            const isReversed = orientation !== desiredOrientation;
            const path = isReversed ? out.path.toReversed() : out.path;
            // paths.push(path);  // For debug only

            const containersForPath: Set<Container> = new Set();
            for (const inOut of path) {
                const { twin } = inOut;
                const dir_ = inOut.dir * (isReversed ? -1 : 1) as -1|1;

                const inOut_ = rebuildInOut(inOut, dir_, isReversed);
                const twin_ = rebuildInOut(twin, -dir_ as -1|1, isReversed);
                (inOut_ as Mutable<In|Out>).twin = twin_;
                (twin_ as Mutable<In|Out>).twin = inOut_;

                const container1 = getOrCreateRerunContainer(containers_, inOut._x_.container);
                container1.inOuts.push(inOut_)
                const container2 = getOrCreateRerunContainer(containers_, twin._x_.container);
                container2.inOuts.push(twin_);

                (inOut_ as Mutable<In|Out>).container = container1;
                (twin_ as Mutable<In|Out>).container = container2;

                const loop = bezierPiecesToBeziers$(_loopss[i][j]);
                inOut_.loop = loop;
                twin_.loop = loop; 

                containersForPath.add(container1);
            }

            containersPerPath.push(containersForPath);
        }
    }

    const minYContainerSet: Set<Container> = new Set();
    for (let i=0; i<containersPerPath.length; i++) {
        const containersForPath = containersPerPath[i];

        let minContainer: Container;
        let minY = Infinity;
        for (const c of containersForPath) {
            if (c.box[0][1] < minY) {
                minContainer = c;
                minY = c.box[0][1];
            }
        }

        minYContainerSet.add(minContainer!);
    }

    containers_.forEach(container_ => {
        if (container_.inOuts.length > 2 || minYContainerSet.has(container_)) {
            container_.inOuts.sort(compareInOut);
        }
    });

    containers_.forEach(container_ => setNextAndPrevAround(container_.inOuts));

    const minYContainers = Array.from(minYContainerSet);
    minYContainers.sort((a,b) => a.box[0][1] - b.box[0][1]);

    return { containers_, minYContainers };
}


export { rewireContainers }
