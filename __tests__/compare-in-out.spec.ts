import type { InOut } from '../src/in-out';
import { compareInOut } from '../src/calc-containers/get-container-in-outs/get-in-outs-via-sides/compare-in-out';


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
        p: undefined!,          // not used in `compareInOut`
        pBox: undefined!        // not used in `compareInOut`
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
        p: undefined!,          // not used in `compareInOut`
        pBox: undefined!        // not used in `compareInOut`
    }

    const rAB = compareInOut(inOutA, inOutB);
    const rBA = compareInOut(inOutB, inOutA);

    expect(rAB).toBeLessThan(0);
    expect(rBA).toBeGreaterThan(0);
});