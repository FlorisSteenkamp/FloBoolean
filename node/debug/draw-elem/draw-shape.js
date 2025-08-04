import { DEFAULT_CLASS } from './default-class';
import { XMLNS } from './xmlns';
import { beziersToSvgPathStr } from '../../svg/beziers-to-svg-path-str';
// TODO - move to flo-draw
/**
 * Draws an SVG shape
 * @param g
 * @param shape the shape specified as an array of bezier curves
 *
 * * the last point does not have to be specified
 *
 * @param class_
 * @param delay
 */
function drawShape(g, beziers, class_ = DEFAULT_CLASS, delay) {
    const $path = document.createElementNS(XMLNS, 'path');
    const d = beziersToSvgPathStr(beziers);
    $path.setAttributeNS(null, "d", d);
    if (class_) {
        $path.setAttributeNS(null, "class", class_);
    }
    g.appendChild($path);
    if (delay) {
        setTimeout(() => $path.remove(), delay);
    }
    return [$path];
}
export { drawShape };
//# sourceMappingURL=draw-shape.js.map