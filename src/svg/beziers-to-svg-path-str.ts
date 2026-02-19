
/**
 * Returns an SVG path string representation of the given bezier loop.
 * 
 * @param beziers an array of bezier curves each given as an array of 
 * control points
 */
 function beziersToSvgPathStr(
        beziers: number[][][]) {

    const strs: string[] = [];
    for (let i=0; i<beziers.length; i++) {
        const ps = beziers[i];
        if (i === 0) {
            strs.push(
                'M ' + 
                ps[0][0].toString() + ' ' + 
                ps[0][1].toString()
            );
        }
        
        if (ps.length === 4) {
            strs.push('C ' + 
                ps[1][0].toString() + ' ' + 
                ps[1][1].toString() + ' ' +
                ps[2][0].toString() + ' ' + 
                ps[2][1].toString() + ' ' +
                ps[3][0].toString() + ' ' + 
                ps[3][1].toString() + ' '
            );
        } else if (ps.length === 3) {
            strs.push(
                'Q ' + 
                ps[1][0].toString() + ' ' + 
                ps[1][1].toString() + ' ' +
                ps[2][0].toString() + ' ' + 
                ps[2][1].toString() + ' '
            );
        } else if (ps.length === 2) {
            strs.push(
                'L ' + 
                ps[1][0].toString() + ' ' + 
                ps[1][1].toString() + ' '
            );
        }
    }

    strs.push(' z');

    return strs.join('\n');
}


export { beziersToSvgPathStr }
