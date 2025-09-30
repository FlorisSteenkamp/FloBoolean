import { DEFAULT_CLASS } from './default-class.js';
import { XMLNS } from './xmlns.js';
import { beziersToSvgPathStr } from '../../svg/beziers-to-svg-path-str.js';
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
function drawShape(g, bezierLoops, class_ = DEFAULT_CLASS, delay) {
    const $path = document.createElementNS(XMLNS, 'path');
    let d = '';
    for (let i = 0; i < bezierLoops.length; i++) {
        d += beziersToSvgPathStr(bezierLoops[i]);
        d += '\n\n';
    }
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