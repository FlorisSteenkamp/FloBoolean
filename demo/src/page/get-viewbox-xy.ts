
function getViewboxXY(
        svg$: SVGSVGElement,
        viewbox: number[][], 
        pixelsX: number, 
        pixelsY: number): number[] {

    const boundingRect = svg$.getBoundingClientRect(); 
    const pixelsW = boundingRect.width;
    const pixelsH = boundingRect.height;

    const viewboxW = viewbox[1][0] - viewbox[0][0];
    const viewboxH = viewbox[1][1] - viewbox[0][1];

    const viewboxX = ((pixelsX/pixelsW) * viewboxW) + viewbox[0][0];
    const viewboxY = ((pixelsY/pixelsH) * viewboxH) + viewbox[0][1];

    return [viewboxX, viewboxY];
}


export { getViewboxXY }
