import { drawFs } from 'flo-draw';
function drawContainer(g, container, classes, delay = 0) {
    let rect = container.box;
    let xs = container.xs;
    let scale = 2 ** 0 * 0.0125;
    // intersections
    let $circles = [];
    for (let i = 0; i < xs.length; i++) {
        let x = xs[i];
        $circles.push(...drawFs.circle(g, { center: x.x.box[0], radius: scale }, 'thin2 red nofill', delay));
    }
    // text showing intersection ordering
    let $texts = [];
    let inOuts = container.inOuts;
    for (let i = 0; i < inOuts.length; i++) {
        let inOut = inOuts[i];
        let p = inOut.p.slice();
        let color = inOut.dir === -1 ? 'red' : 'blue';
        let size = scale * (1 + (0.5 * i));
        if (inOut.idx !== undefined) {
            $texts.push(...drawFs.text(g, p, inOut.idx.toString(), scale * 8, `thin5 nofill ${color}`, delay));
        }
        $circles.push(...drawFs.dot(g, inOut.p, size, `thin2 nofill ${color}`, delay));
    }
    // container rect
    let $outline = drawFs.rect(g, rect, 'thin2 blue nofill', delay);
    return [...$outline, ...$circles, ...$texts];
}
export { drawContainer };
//# sourceMappingURL=draw-container.js.map