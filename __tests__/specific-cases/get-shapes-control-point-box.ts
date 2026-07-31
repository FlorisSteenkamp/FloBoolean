import { getShapeControlPointBox } from '../../src/shape/get-shape-control-point-box.js';

const { max, min, ceil, log2, abs } = Math;


function getShapesControlPointBox(
        shapes: (number[][])[][]) {

    return shapes.map(getShapeControlPointBox).reduce((acc, b) => {
        return [
            [min(acc[0][0], b[0][0]), min(acc[0][1], b[0][1])],
            [max(acc[1][0], b[1][0]), max(acc[1][1], b[1][1])]
        ];
    }, [[Infinity, Infinity], [-Infinity, -Infinity]]);
}


export { getShapesControlPointBox }
