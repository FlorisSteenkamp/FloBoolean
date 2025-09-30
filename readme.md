# Boolean operations and path simplification on shapes

This library performs shape simplification via `simplifyPaths` and boolean operations
via `boolean`.

---
Bug reports, pull requests and ⭐⭐⭐⭐⭐s are welcome and appreciated!

---

# Installation

```cli
npm install flo-boolean
```

# Shape simplification

`simplifyPaths` can be used to simplify shape paths so that all returned sets of shapes
after simplification has an outer shape (with winding number +1, resp. -1) with inner
shapes (with winding number -1, resp. +1).

```ts
import { getPathsFromStr, simplifyPaths, boolean, OR, AND, XOR, Loop } from 'flo-boolean';

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

const r = simplifyPaths(paths, undefined, { inclMicroCorners: false });

// Now `r` consist of 2 sets of loops, each set containing a single loop (see fig. below)
r[0][0].beziers;  //=> `[ [[300, 2], [200, -50], ...`
r[1][0].beziers;  //=>  [ [[174.99999999999994, 41.108796296296305], ...`
```

![Shape simplification - loop 1](https://raw.github.com/FlorisSteenkamp/FloBoolean/master/figs/koldat55-1a.png)
![Shape simplification - loop 2](https://raw.github.com/FlorisSteenkamp/FloBoolean/master/figs/koldat55-2a.png)

# Boolean operations

`boolean` performs shape boolean operations, e.g.

```ts
import { getPathsFromStr, simplifyPaths, boolean, OR, AND, XOR, Loop } from 'flo-boolean';

// Say we have the following svg path strings (there can be more than 2)

const svgPathStrA = `
    M 81 35
    Q 81  34  80  34
    Q 80  35  79  34.8
    Z
    
    M 79  34
    L 79  32.8
    L 80  34
    Z`;

const svgPathStrB = `
    M 79.4  33
    L 80.5  33
    L 80.5  34.7
    L 79.4 34.7
    Z`;

const svgPathStrs = [svgPathStrA, svgPathStrB];

// Convert them to an array of bezier curves forming "closed loops"
const pathss = svgPathStrs.map(getPathsFromStr);


const r = boolean(pathss, XOR);
// `r` consist of new sets of loops being the boolean operation specified, i.e.
// `OR`, `AND` or `XOR`. (see figs. below)

r[0][0].beziers;  //=> [ ... ]
r[1][0].beziers;  //=> [ ... ]
r[2][0].beziers;  //=> [ ... ]
r[3][0].beziers;  //=> [ ... ]
r[4][0].beziers;  //=> [ ... ]

// You can also create your own custom operator (see other operators as examples)
```

![Boolean XOR - before](https://raw.github.com/FlorisSteenkamp/FloBoolean/master/figs/koldat52-over-square.png)
![Boolean XOR - after](https://raw.github.com/FlorisSteenkamp/FloBoolean/master/figs/koldat52-over-square-xor.png)


# ESM note
This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
and can be used in `Node.js` (or in a browser when bundled using e.g. Webpack).

Additionally, self-contained `ECMAScript Module` (ESM) files `index.js` and
`index.min.js` in the `./browser` folder are provided.


# License
The MIT License (MIT)

Copyright © 2025 Floris Steenkamp

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.