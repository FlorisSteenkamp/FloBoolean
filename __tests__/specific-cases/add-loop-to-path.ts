import type { CanvasRenderingContext2D } from 'canvas';


/** Adds a single loop (outer boundary or hole) to the current path. */
function addLoopToPath(
        ctx: CanvasRenderingContext2D,
        loop: (number[][])[]) {

    let started = false;
    for (const ps of loop) {
        if (!started) {
            ctx.moveTo(ps[0][0], ps[0][1]);
            started = true;
        }
        if (ps.length === 2) {
            ctx.lineTo(ps[1][0], ps[1][1]);
        }
        else if (ps.length === 3) {
            ctx.quadraticCurveTo(
                ps[1][0], ps[1][1],
                ps[2][0], ps[2][1]
            );
        }
        else if (ps.length === 4) {
            ctx.bezierCurveTo(
                ps[1][0], ps[1][1],
                ps[2][0], ps[2][1],
                ps[3][0], ps[3][1]
            );
        }
    }
    ctx.closePath();
}


export { addLoopToPath }
