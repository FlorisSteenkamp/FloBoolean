import { getControlPointBox } from "flo-bezier3";


function getShapeControlPointBox(
        shape: (number[][])[]): [[number, number], [number, number]] {

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const ps of shape) {
        const [[cminX, cminY], [cmaxX, cmaxY]] = getControlPointBox(ps);

        if (cminX < minX) { minX = cminX; }
        if (cminY < minY) { minY = cminY; }
        if (cmaxX > maxX) { maxX = cmaxX; }
        if (cmaxY > maxY) { maxY = cmaxY; }
    }

    return [[minX, minY], [maxX, maxY]];
}


export { getShapeControlPointBox }
