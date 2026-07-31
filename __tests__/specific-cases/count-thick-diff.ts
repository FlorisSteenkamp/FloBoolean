
/**
 * Returns the number of pixels that differ between the two images and whose
 * entire `radius`-neighbourhood also differs, i.e. the size of the difference
 * after eroding away boundaries up to `radius` px thick. This tolerates
 * sub-pixel edge / rasterization discrepancies and thin near-tangent slivers
 * (whose width is highly sensitive to the exact intersection location) while
 * still catching genuine filled-area differences.
 */
function countThickDiff(
        imgData1: { data: Uint8ClampedArray },
        imgData2: { data: Uint8ClampedArray },
        w: number,
        h: number,
        radius = 2) {

    const d1 = imgData1.data;
    const d2 = imgData2.data;

    // per-pixel boolean: does the pixel's ink (alpha !== 0) differ?
    const diff = new Uint8Array(w * h);
    for (let p=0; p<w*h; p++) {
        const ink1 = d1[p*4 + 3] !== 0 ? 1 : 0;
        const ink2 = d2[p*4 + 3] !== 0 ? 1 : 0;
        diff[p] = ink1 !== ink2 ? 1 : 0;
    }

    let n = 0;
    for (let y=0; y<h; y++) {
        for (let x=0; x<w; x++) {
            const p = y*w + x;
            if (!diff[p]) { continue; }

            // erode: only count if the whole `radius`-neighbourhood also differs
            let eroded = true;
            for (let dy=-radius; dy<=radius && eroded; dy++) {
                for (let dx=-radius; dx<=radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h || !diff[ny*w + nx]) {
                        eroded = false;
                        break;
                    }
                }
            }
            if (eroded) { n++; }
        }
    }

    return n;
}


export { countThickDiff }
