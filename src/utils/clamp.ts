const { min, max } = Math;


function clamp(
        v: number,
        minV: number,
        maxV: number) {

    return min(maxV, max(minV, v));
}


export { clamp }
