import { evalDeCasteljauDd } from "flo-bezier3";


/**
 * Accurately returns the result of evaluating the given bezier curve `ps` at `t`.
 * 
 * @param ps 
 * @param t 
 */
function toP(
        ps: number[][],
        t: number) {

    return evalDeCasteljauDd(ps, [0,t]).map(c => c[0] + c[1]);
}


export { toP }
