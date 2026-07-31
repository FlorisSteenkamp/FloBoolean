
/** Counts the number of non-transparent pixels in the given image data. */
function countInk(imgData: { data: Uint8ClampedArray }) {
    const d = imgData.data;
    let n = 0;
    for (let i=3; i<d.length; i+=4) {
        if (d[i] !== 0) { n++; }
    }
    return n;
}


export { countInk }
