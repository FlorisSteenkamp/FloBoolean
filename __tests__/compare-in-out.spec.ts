import { test, expect } from '@jest/globals';
import type { InOut } from '../src/containers/in-out/in-out.js';
import { compareInOut } from '../src/containers/get-container-in-outs/get-in-outs-via-sides/compare-in-out.js';


test('`compareInOut`', function() {
    const inOutA: InOut = {
        side: 0,
        sideX: {
            ri: { tS: 0.5, tE: 0.5, multiplicity: 1, },
            compensated: undefined,
            box: undefined!,  // not used in `compareInOut`
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
            ri: { tS: 0.6, tE: 0.6, multiplicity: 1, },
            compensated: undefined,
            box: undefined!,  // not used in `compareInOut`
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

    const rAB = compareInOut(1)(inOutA, inOutB);
    const rBA = compareInOut(1)(inOutB, inOutA);

    expect(rAB).toBeLessThan(0);
    expect(rBA).toBeGreaterThan(0);
});