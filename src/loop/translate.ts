
import { translate } from "flo-vector2d"


function translateBeziers(
        v: number[],
        bezierLoops1: number[][][][]): number[][][][] {

    return bezierLoops1.map(loop => loop.map(ps => ps.map(translate(v))));
}


export { translateBeziers }
