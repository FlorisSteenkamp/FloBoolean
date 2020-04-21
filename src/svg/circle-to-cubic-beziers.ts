
const C = 0.551915024494;


/**
 * 
 * @param center 
 * @param radiusX 
 * @param radiusY 
 * @param rotation in degrees
 * @param clockwise 
 */
function circleToCubicBeziers(
        center: number[] = [0,0],
        radiusX: number, 
        radiusY: number,
        rotation: number,
        clockwise = false) {

    let pss = [
        [[0,   1],  [ C,  1],  [ 1,  C],  [ 1,  0]],
        [[1,   0],  [ 1, -C],  [ C, -1],  [ 0, -1]],
        [[0,  -1],  [-C, -1],  [-1, -C],  [-1,  0]],
        [[-1,  0],  [-1,  C],  [-C,  1],  [ 0,  1]]
    ];

    pss = pss.map(ps => ps.map(applyMatrix([
        [radiusX, 0],
        [0, radiusY]
    ])));
    pss = pss.map(ps => ps.map(rotateDegrees(rotation)));
    pss = pss.map(ps => ps.map(translate(center)));

    if (!clockwise) {
        return pss;
    }

    return (
        pss.map( ps => ps.slice().reverse() ).slice().reverse()
    );
}


function rotateDegrees(θ: number) {
    return (p: number[]) => {
        return rotateRad(degToRad(θ), p)
    }
}


function rotateRad(θ: number, p: number[]) {
    let cosθ = Math.cos(θ);
    let sinθ = Math.sin(θ);
    let M = [
        [cosθ, -sinθ],
        [sinθ,  cosθ]
    ];

    return applyMatrix(M)(p);
}


function applyMatrix(M: number[][]) {
    return(p: number[]) => {
        return [
            M[0][0]*p[0] + M[0][1]*p[1],
            M[1][0]*p[0] + M[1][1]*p[1]
        ];
    };
}


function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}


function radToDeg(deg: number) {
    return deg * (180 / Math.PI);
}


function translate(v: number[]) {
    return (p: number[]) => {
        return [p[0] + v[0], p[1] + v[1]];
    }
}


export { circleToCubicBeziers }
