// FUTURE
test.skip('dummy test to silence error', () => {});

// import { getPathsFromStr } from '../src/svg/get-paths-from-str.js';
// import { boolean } from '../src/boolean/boolean.js';
// import { XOR } from '../src/boolean/ops.js';


// test('test for readme - boolean', function() {
//     // import { getPathsFromStr, simplifyPaths, boolean, OR, AND, XOR, Loop } from 'flo-boolean';

//     // Say we have the following svg path strings

//     const svgPathStrA = `
//         M 81 35
//         Q 81  34  80  34
//         Q 80  35  79  34.8
//         Z
        
//         M 79  34
//         L 79  32.8
//         L 80  34
//         Z`;

//     const svgPathStrB = `
//         M 79.4  33
//         L 80.5  33
//         L 80.5  34.7
//         L 79.4 34.7
//         Z`;

//     const svgPathStrs = [svgPathStrA, svgPathStrB];

//     // Convert them to an array of bezier curves forming "closed loops"
//     const pathss = svgPathStrs.map(getPathsFromStr);

//     const r = boolean(pathss, XOR);

//     r[0][0].beziers;  //=> [ ... ]
//     // r[1][0].beziers;  //=> [ ... ]
//     // r[2][0].beziers;  //=> [ ... ]
//     // r[3][0].beziers;  //=> [ ... ]
//     // r[4][0].beziers;  //=> [ ... ]

//     // `r` consist of new sets of loops being the boolean operation specified, i.e.
//     // `OR`, `AND` or `XOR`. (see figs. below)

//     // You can also create your own custom operator (see other operators as examples)
// });