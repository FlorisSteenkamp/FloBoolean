import { test, expect } from '@jest/globals';
import { simplifyPaths } from '../src/main/simplify-paths.js';
import { getPathsFromStr } from '../src/svg/get-paths-from-str.js';
import { getTurningNumber } from '../src/shape/get-turning-number.js';


test('options', function() {
    // Two concentric squares
    //   * outer: positive turning
    //   * inner  negative turning
    const pathStr = `
        M 0 0   L 3 0   L 3 3   L 0 3   Z
        M 1 1   L 1 2   L 2 2   L 2 1   Z
    `;

    const loopss = getPathsFromStr(pathStr);

    {
        //----------------------
        // No options specified
        //----------------------
        const loops = simplifyPaths(loopss)[0];

        const w0 = getTurningNumber(loops[0].beziers);
        const w1 = getTurningNumber(loops[1].beziers);

        expect(w0).toEqual(+1);
        expect(w1).toEqual(-1);
    }

    {
        //----------------------
        // Empty options specified
        //----------------------
        const loops = simplifyPaths(loopss, {})[0];

        const w0 = getTurningNumber(loops[0].beziers);
        const w1 = getTurningNumber(loops[1].beziers);

        expect(w0).toEqual(+1);
        expect(w1).toEqual(-1);
    }

    {
        //----------------------------
        // Force outer loops negative
        //----------------------------
        const loops = simplifyPaths(loopss, {
            forceOrientationNegative: true
        })[0];

        const w0 = getTurningNumber(loops[0].beziers);
        const w1 = getTurningNumber(loops[1].beziers);

        expect(w0).toEqual(-1);
        expect(w1).toEqual(+1);
    }
});