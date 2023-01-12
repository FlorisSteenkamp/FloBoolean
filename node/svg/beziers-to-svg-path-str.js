/**
 * Returns an SVG path string representation of the given bezier loop.
 * @param beziers An array of bezier curves each given as an array of
 * control points.
 */
function beziersToSvgPathStr(beziers) {
    let str = '';
    for (let i = 0; i < beziers.length; i++) {
        const ps = beziers[i];
        if (i === 0) {
            str = 'M ' +
                ps[0][0].toString() + ' ' +
                ps[0][1].toString() + '\n';
        }
        if (ps.length === 4) {
            str += 'C ' +
                ps[1][0].toString() + ' ' +
                ps[1][1].toString() + ' ' +
                ps[2][0].toString() + ' ' +
                ps[2][1].toString() + ' ' +
                ps[3][0].toString() + ' ' +
                ps[3][1].toString() + ' ' + '\n';
        }
        else if (ps.length === 3) {
            str += 'Q ' +
                ps[1][0].toString() + ' ' +
                ps[1][1].toString() + ' ' +
                ps[2][0].toString() + ' ' +
                ps[2][1].toString() + ' ' + '\n';
        }
        else if (ps.length === 2) {
            str += 'L ' +
                ps[1][0].toString() + ' ' +
                ps[1][1].toString() + ' ' + '\n';
        }
    }
    return str + ' z' + '\n';
}
export { beziersToSvgPathStr };
//# sourceMappingURL=beziers-to-svg-path-str.js.map