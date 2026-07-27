import { test, expect } from '@jest/globals';
import type { Container } from '../../src/containers/container';
import { getInOutsOfContainer } from '../../src/containers/get-container-in-outs/get-in-outs-via-sides/get-in-outs-via-sides';
import { getPathFromFile } from '../helpers/get-path-from-file';
import { getMaxCoordinate } from '../../src/loop/normalize/get-max-coordinate';
import { normalizeLoops } from '../../src/loop/normalize/normalize-loop';
import { orderLoopAscendingByMinY } from '../../src/calc-paths/order-loop-ascending-by-min-y';
import { loopFromBeziers } from '../../src/loop/loop-from-beziers';
import { getContainers } from '../../src/containers/get-containers/get-containers';
import { SimplifyOptions } from '../../src/main/simplify-options';
import { prepLoops } from '../../src/main/simplify-paths';

const { ceil, log2, abs } = Math;


const MAX_BIT_LENGTH = 46;
const containerSizeMultiplier = 2**4;

test('getInOutsViaSides', function() {
    {
        const filename = 'complexish';
        const { bezierLoops } = getPathFromFile(filename, true); 

        const { extremes, containers, loops, expMax } = prepLoops(
            bezierLoops, undefined, containerSizeMultiplier
        );

        // containers;//?

        // getInOutsViaSides(container, 0) {

        // }

        expect(0).toStrictEqual(0);
    }
});
