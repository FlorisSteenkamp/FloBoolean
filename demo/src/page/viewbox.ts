import { getShapeBounds } from "../../../src/calc-paths/get-shape-bounds.js";


function getViewBoxForShape(bezierLoops: number[][][][]) {
    let minX_ = Number.POSITIVE_INFINITY;
    let minY_ = Number.POSITIVE_INFINITY;
    let maxX_ = Number.NEGATIVE_INFINITY;
    let maxY_ = Number.NEGATIVE_INFINITY;
    for (const bezierLoop of bezierLoops) {
        const { minX, maxX, minY, maxY } = getShapeBounds(bezierLoop);
        if (minX < minX_) { minX_ = minX }
        if (minY < minY_) { minY_ = minY }
        if (maxX > maxX_) { maxX_ = maxX }
        if (maxY > maxY_) { maxY_ = maxY }
    }

    const width = maxX_-minX_;
    const height = maxY_-minY_;

    // The margin around the shape
    const c = Math.max(width, height) * 0.05;

    return [[minX_-c, minY_-c], [maxX_+c, maxY_+c]];
}


function getViewBoxForShapes(bezierLoopss: number[][][][][]) {
    let minX_ = Number.POSITIVE_INFINITY;
    let minY_ = Number.POSITIVE_INFINITY;
    let maxX_ = Number.NEGATIVE_INFINITY;
    let maxY_ = Number.NEGATIVE_INFINITY;
    for (const bezierLoops of bezierLoopss) {
        for (const bezierLoop of bezierLoops) {
            const { minX, maxX, minY, maxY } = getShapeBounds(bezierLoop);
            if (minX < minX_) { minX_ = minX }
            if (minY < minY_) { minY_ = minY }
            if (maxX > maxX_) { maxX_ = maxX }
            if (maxY > maxY_) { maxY_ = maxY }
        }
    }

    const width = maxX_-minX_;
    const height = maxY_-minY_;

    // The margin around the shape
    const c = Math.max(width, height) * 0.05;

    return [[minX_-c, minY_-c], [maxX_+c, maxY_+c]];
}


function toViewBoxStr(viewbox: number[][]) {
    const [x,y] = viewbox[0];
    const w = viewbox[1][0] - x;
    const h = viewbox[1][1] - y;
    return '' + 
        x.toFixed(5) + ' ' + 
        y.toFixed(5) + ' ' + 
        w.toFixed(5) + ' ' + 
        h.toFixed(5);
}


export { 
    getViewBoxForShape,
    getViewBoxForShapes,
    toViewBoxStr
};
