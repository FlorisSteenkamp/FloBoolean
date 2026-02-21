[![npm][1]][2] [![downloads][5]][2]

[1]: https://img.shields.io/npm/v/flo-boolean "FloBoolean, npm badge"
[2]: https://www.npmjs.com/package/flo-boolean "FloBoolean, npm link"
[5]: https://badgen.now.sh/npm/dm/flo-boolean "FloBoolean downloads, badge"

# Boolean operations on shapes

This library performs shape boolean operations via the function `boolean`.

**Note**: what is usually called a boolean operation is really a "winding number
function", to be specific:
* AND (intersect) → regions are kept with absolute winding number > 1
* OR (union) → regions are kept with absolute winding number >= 1
* XOR (exclude) → non-overlapping regions are kept, i.e. regions with winding number === 1 are kept

**Note**: Since version 5 of this library the `boolean` function has changed
completely to more accurately reflect what is usually meant by a boolean
operation (within vector design software, see above)

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

However, this returns exactly the same result as `boolean('OR', ...)`

# Boolean operations

```ts
import { getPathsFromStr, boolean } from 'flo-boolean';

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

// Now `loops` consist of of loops
loops[0];  //=> `[ [[300, 2], [200, -50], ...`
loops[1];  //=>  [ [[174.99999999999994, 41.108796296296305], ...`
```

![Shape simplification - loop 1](https://raw.github.com/FlorisSteenkamp/FloBoolean/master/figs/koldat55-1a.png)
![Shape simplification - loop 2](https://raw.github.com/FlorisSteenkamp/FloBoolean/master/figs/koldat55-2a.png)


## Another example

```ts
import { getPathsFromStr, boolean } from 'flo-boolean';

// Say we have the following svg path string

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

loops[0];  //=> [ ... ]
loops[1];  //=> [ ... ]
loops[2];  //=> [ ... ]
loops[3];  //=> [ ... ]
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