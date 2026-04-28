import { test, expect } from '@jest/globals';
import { getPathsFromStr } from '../src/svg/get-paths-from-str.js';
import { boolean } from '../src/boolean/boolean.js';


test('test for readme - boolean', function() {
    {  // OR example
        const svgPathStr = `
            M 0 0
            C 100 50   200 60  300 2
            C 200 -50  100 -70 0 0
            Z

            M 125 25
            L 175 25
            L 175 55
            L 125 55
            Z`;

        const paths = getPathsFromStr(svgPathStr);
        // `paths` now consists of two 'bezier loops', i.e.
        // `paths === [
        //   [
        //     [ [ 0, 0 ], [ 100, 50 ], [ 200, 60 ], [ 300, 2 ] ],
        //     [ [ 300, 2 ], [ 200, -50 ], [ 100, -70 ], [ 0, 0 ] ],
        //     [ [ 0, 0 ], [ 0, 0 ] ]
        //   ],
        //   [
        //     [ [ 125, 25 ], [ 175, 25 ] ],
        //     [ [ 175, 25 ], [ 175, 55 ] ],
        //     [ [ 175, 55 ], [ 125, 55 ] ],
        //     [ [ 125, 55 ], [ 125, 25 ] ]
        //   ]
        // ]`

        const loops = boolean('OR', paths);

        // Now `loops` consist of 2 sets of loops, each set containing a single loop (see fig. below)
        loops[0];  //=> `[ [[300, 2], [200, -50], ...`
        loops[1];  //=>  [ [[174.99999999999994, 41.108796296296305], ...`
    }


    {  // XOR example
        const svgPathStr = `
            M 81 35
            Q 81  34  80  34
            Q 80  35  79  34.8
            Z
            
            M 79  34
            L 79  32.8
            L 80  34
            Z

            M 79.4  33
            L 80.5  33
            L 80.5  34.7
            L 79.4 34.7
            Z`;

        // Convert them to an array of bezier curves forming "closed loops"
        const paths = getPathsFromStr(svgPathStr);

        const loops = boolean('XOR', paths);
        // `loops` consist of a new array of loops being the boolean operation specified, i.e.
        // `"OR"`, `"AND"` or `"XOR"`. (see figs. below)

        loops[0];  //?
        loops[1];  //?
        loops[2];  //?
        loops[3];  //?
    }
});