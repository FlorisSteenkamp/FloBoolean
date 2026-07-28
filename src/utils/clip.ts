const { min, max } = Math;


function clip(
        v: number,
        minV: number,
        maxV: number) {

    return min(1, max(0, v));
}


export { clip }
