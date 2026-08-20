import { test, expect } from '@jest/globals';
import type { InOut } from '../src/containers/in-out/in-out.js';
import { createRootExact } from 'flo-poly';
import { compareInOut } from '../src/containers/get-container-in-outs/get-in-outs-via-sides/compare-in-out.js';


test.skip('`compareInOut`', function() {
    const inOutA: InOut = {
        side: 0,
        sideX: {
            ri: createRootExact(0.5),
            compensated: undefined,
            kind: undefined!  // ...
        },
        dir: -1,
        idx: 0,
        container: undefined!,  // not used in `compareInOut`
        p: undefined!,          // ...
        children: new Set([]),  // ...
        windingNum: 0,          // ...
        orientation: 0          // ...
    }

    const inOutB: InOut = {
        side: 0,
        sideX: {
            ri: createRootExact(0.6),
            compensated: undefined,
            kind: undefined!  // ...
        },
        dir: -1,
        idx: 0,
        container: undefined!,  // not used in `compareInOut`
        p: undefined!,          // ...
        children: new Set([]),  // ...
        windingNum: 0,          // ...
        orientation: 0          // ...
    }

    const rAB = compareInOut(inOutA, inOutB);
    const rBA = compareInOut(inOutB, inOutA);

    expect(rAB).toBeLessThan(0);
    expect(rBA).toBeGreaterThan(0);
});