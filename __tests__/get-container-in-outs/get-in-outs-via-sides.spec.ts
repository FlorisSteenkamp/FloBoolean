import { test, expect } from '@jest/globals';
import type { Container } from '../../src/containers/container.js';
import { getInOutsOfContainer } from '../../src/containers/get-container-in-outs/get-in-outs-via-sides/get-in-outs-via-sides.js';
import { getPathFromFile } from '../helpers/get-path-from-file.js';
import { getContainers } from '../../src/containers/get-containers/get-containers.js';
import { prepLoops } from '../../src/main/simplify-paths.js';

const { ceil, log2, abs } = Math;


const containerSizeMultiplier = 2**4;

test('getInOutsViaSides', function() {
    {
        const filename = 'complexish';
        const { bezierLoops } = getPathFromFile(filename); 

        const { minYXPairs, loops, expMax } = prepLoops(bezierLoops);
        const containers = getContainers(loops, minYXPairs, expMax);

        // containers;//?

        // getInOutsViaSides(container, 0) {

        // }

        expect(0).toStrictEqual(0);
    }
});
