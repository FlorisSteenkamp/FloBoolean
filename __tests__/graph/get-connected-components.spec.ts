import { test, expect } from '@jest/globals';
import { getConnectedComponents } from '../../src/graph/get-connected-components.js';
import type { Graph } from '../../src/graph/get-connected-components.js';


test('`getConnectedComponents` returns connected sub-graphs', function() {
    // 1 - 2, and 3 - 4
    const graph: Graph<number> = new Map([
        [1, [2]],
        [2, [1]],
        [3, [4]],
        [4, [3]],
    ]);

    const components = getConnectedComponents(graph);

    expect(components).toEqual([[1, 2], [3, 4]]);
});


test('`getConnectedComponents` includes isolated vertices from `items`', function() {
    // 1 - 2 connected; 3 and 4 are isolated (keys with empty adjacency lists)
    const graph: Graph<number> = new Map([
        [1, [2]],
        [2, [1]],
        [3, []],
        [4, []],
    ]);

    const components = getConnectedComponents(graph);

    expect(components).toEqual([[1, 2], [3], [4]]);
});


test('`getConnectedComponents` with only isolated vertices', function() {
    const graph: Graph<number> = new Map([
        [1, []],
        [2, []],
        [3, []],
    ]);

    const components = getConnectedComponents(graph);

    expect(components).toEqual([[1], [2], [3]]);
});

