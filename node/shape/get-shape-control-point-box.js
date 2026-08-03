import { getControlPointBox } from "flo-bezier3";
function getShapeControlPointBox(shape) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const ps of shape) {
        const [[cminX, cminY], [cmaxX, cmaxY]] = getControlPointBox(ps);
        if (cminX < minX) {
            minX = cminX;
        }
        if (cminY < minY) {
            minY = cminY;
        }
        if (cmaxX > maxX) {
            maxX = cmaxX;
        }
        if (cmaxY > maxY) {
            maxY = cmaxY;
        }
    }
    return [[minX, minY], [maxX, maxY]];
}
export { getShapeControlPointBox };
//# sourceMappingURL=get-shape-control-point-box.js.map