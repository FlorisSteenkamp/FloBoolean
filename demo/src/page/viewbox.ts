import { getBounds_ } from "../get-bounds-.js";


function getLoopBounds(pss: number[][][]) {
    const bounds = pss.map(ps => getBounds_(ps))
    return {
        minX: Math.min(...bounds.map(bound => bound.box[0][0])),
        maxX: Math.max(...bounds.map(bound => bound.box[1][0])),
        minY: Math.min(...bounds.map(bound => bound.box[0][1])),
        maxY: Math.max(...bounds.map(bound => bound.box[1][1])),
    };
}


function getViewBoxForShape(bezierLoops: number[][][][]) {
    let minX_ = Number.POSITIVE_INFINITY;
    let minY_ = Number.POSITIVE_INFINITY;
    let maxX_ = Number.NEGATIVE_INFINITY;
    let maxY_ = Number.NEGATIVE_INFINITY;
    for (const bezierLoop of bezierLoops) {
        const { minX, maxX, minY, maxY } = getLoopBounds(bezierLoop);
        if (minX < minX_) { minX_ = minX }
        if (minY < minY_) { minY_ = minY }
        if (maxX > maxX_) { maxX_ = maxX }
        if (maxY > maxY_) { maxY_ = maxY }
    }

    const width = maxX_-minX_;
    const height = maxY_-minY_;

    // The margin around the shape
    const c = Math.max(width, height) * 0.02;

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
    toViewBoxStr
};
