import { test, expect } from '@jest/globals';
import { degToRad, radToDeg } from '../src/svg/circle-to-cubic-beziers.js';
import { dot, rotate } from "flo-vector2d";
import { ddGetShapeCentroid, getShapeCentroid } from '../src/loop/get-loop-centroid.js';
import { getPrincipalAxes, ddGetPrincipalAxes } from '../src/loop/get-principal-axes.js';
import { reverseShapeOrientation } from '../src/loop/reverse-shape-orientation.js';

const { sin, cos, sqrt, atan2 } = Math;


test('getPrincipalAxes', function() {
    {
    //     // const pss = ([
    //     //     [ [ 206, 1093 ], [ 221, 1372 ] ],
    //     //     [ [ 221, 1372 ], [ 221, 1456 ] ],
    //     //     [ [ 221, 1456 ], [ 189, 1456 ] ],
    //     //     [ [ 189, 1456 ], [ 189, 1372 ] ],
    //     //     [ [ 189, 1372 ], [ 206, 1093 ] ]
    //     // ]);
    //     // const pss = [
    //     //     [ [ -78.5, -268.26307130989994 ], [ 78.5, -268.26307130989994 ] ],
    //     //     [ [ 78.5, -268.26307130989994 ], [ 94.5, 106.73692869010006 ] ],
    //     //     [ [ 94.5, 106.73692869010006 ], [ 94.5, 250.73692869010006 ] ],
    //     //     [ [ 94.5, 250.73692869010006 ], [ -94.5, 250.73692869010006 ] ],
    //     //     [ [ -94.5, 250.73692869010006 ], [ -94.5, 106.73692869010006 ] ],
    //     //     [ [ -94.5, 106.73692869010006 ], [ -78.5, -268.26307130989994 ] ]
    //     // ];
    //     const pss = [
    //         [ [ 0, -236.73825503355692 ], [ 16, 42.261744966443075 ] ],
    //         [ [ 16, 42.261744966443075 ], [ 16, 126.26174496644308 ] ],
    //         [ [ 16, 126.26174496644308 ], [ -16, 126.26174496644308 ] ],
    //         [ [ -16, 126.26174496644308 ], [ -16, 42.261744966443075 ] ],
    //         [ [ -16, 42.261744966443075 ], [ 0, -236.73825503355692 ] ]
    //     ];

    //     const C = ddGetShapeCentroid(pss);//?
    //     expect(C[0]).toStrictEqual([0,0]);
    //     expect(C[1][1]).toBeCloseTo(1.2207982574133265e-13, 13);

    //     const R = -10;
    //     for (let i=R; i<=R; i += 10) {
    //         const θ = i;
    //         const sinθ = sin(degToRad(θ));
    //         const cosθ = cos(degToRad(θ));
    //         const rot = rotate(sinθ, cosθ);

    //         const _pss_ = pss.map(ps => ps.map(rot));

    //         const principalAxes = getPrincipalAxes(_pss_);
    //         const principalAxes_ = ddGetPrincipalAxes(_pss_);

    //         const { eigenValues, eigenVectors: [v1,v2] } = principalAxes;
    //         const { eigenValues: eigenValues_, eigenVectors: [v1_,v2_] } = principalAxes_;
    //         const θ0r = atan2(v1[1], v1[0]);
    //         const θ1r = atan2(v2[1], v2[0]);
    //         // v1;//?
    //         // v2;//?
    //         const dotProd = dot(v1,v2);//?
    //         expect(dotProd).toStrictEqual(0.0625);

    //         const θ0r_ = atan2(v1_[1], v1_[0]);
    //         const θ1r_ = atan2(v2_[1], v2_[0]);
    //         const dotProd_ = dot(v1_,v2_);//?
    //         expect(dotProd_).toStrictEqual(-0.0625);

    //         v1; //?
    //         v1_;//?
    //         v2; //?
    //         v2_;//?

    //         expect(v1[0]).toBeCloseTo(-8728725.83586225, 13);
    //         expect(v1[1]).toBeCloseTo(-49503064.1413533, 13);
    //         expect(v1_[0]).toBeCloseTo(-8728725.83586225, 7);
    //         expect(v1_[1]).toBeCloseTo(-49503064.1413533, 6);

    //         eigenValues;//?
    //         expect(eigenValues[0]).toBeCloseTo(419840, 7);
    //         expect(eigenValues[1]).toBeCloseTo(51462014.013422854, 7);

    //         // const [θ1d,θ2d] = [θ0r,θ1r].map(radToDeg);//?
    //         // const [θ1d_,θ2d_] = [θ0r_,θ1r_].map(radToDeg);//?

    //         const θ0d = (radToDeg(θ0r) + 180)%180;//?
    //         const θ1d = (radToDeg(θ1r) + 180)%180;//?
    //         const θ0d_ = (radToDeg(θ0r_) + 180)%180;//?
    //         const θ1d_ = (radToDeg(θ1r_) + 180)%180;//?

    //         expect(θ0d).toBeCloseTo(80, 12);
    //         expect(θ1d).toBeCloseTo(170, 12);
    //         expect(θ0d_).toBeCloseTo(80, 12);
    //         expect(θ1d_).toBeCloseTo(170, 12);
            
    //         // oblongness measure
    //         sqrt(eigenValues[1])/sqrt(eigenValues[0]);//?
    //     }
    // }


    // {
    //     //--------------
    //     // Some ellipse
    //     //--------------
    //     const K = 0.5519150244935105707435627;
    //     const F = 1;
    //     const G = 1;
    //     const pss = ([
    //         [[0,1*G], [K*F,1*G], [1*F,K*G], [1*F,0]],  // quarter ellipse
    //         [[1*F,0], [1*F,-K*G], [K*F,-1*G], [0,-1*G]],
    //         [[0,-1*G], [-K*F,-1*G], [-1*F,-K*G], [-1*F,0]],
    //         [[-1*F,0], [-1*F,K*G], [-K*F,1*G], [0,1*G]]
    //     ]);

    //     const pss_ = reverseShapeOrientation(pss);

    //     for (let i=-180; i<=180; i += 10) {
    //         const θ = i;
    //         const sinθ = sin(degToRad(θ));
    //         const cosθ = cos(degToRad(θ));
    //         const rot = rotate(sinθ, cosθ);

    //         const _pss_ = pss_.map(ps => ps.map(rot));

    //         const principalAxes = getPrincipalAxes(_pss_);

    //         const { eigenValues, eigenVectors: [v0,v1] } = principalAxes;
    //         // eigenValues;
    //         v0;
    //         const θ0r = atan2(v0[1], v0[0]);
    //         const θ1r = atan2(v1[1], v1[0]);
    //         // const dotProd = dot(v0,v1);

    //         // eigenValues;
    //         // const [θ1d,θ2d] = [θ1r,θ2r].map(radToDeg);
    //         const θ0d = (radToDeg(θ0r) + 180)%180;
    //         const θ1d = (radToDeg(θ1r) + 180)%180;

    //         sqrt(eigenValues[1])/sqrt(eigenValues[0]);
    //     }
    // }


    // {
    //     //--------------
    //     // Some shape
    //     //--------------
    //     const K = 0.5519150244935105707435627;
    //     const F = 100;
    //     const G = 2;
    //     const pss = ([
    //         [
    //             [ -199.67698673219854, -273.43191208212966 ],
    //             [ 198.32301326780146, -273.43191208212966 ]
    //         ],
    //         [
    //             [ 198.32301326780146, -273.43191208212966 ],
    //             [ 209.32301326780146, 82.56808791787034 ]
    //         ],
    //         [
    //             [ 209.32301326780146, 82.56808791787034 ],
    //             [ 209.32301326780146, 268.56808791787034 ]
    //         ],
    //         [
    //             [ 209.32301326780146, 268.56808791787034 ],
    //             [ -208.67698673219854, 268.56808791787034 ]
    //         ],
    //         [
    //             [ -208.67698673219854, 268.56808791787034 ],
    //             [ -208.67698673219854, 82.56808791787034 ]
    //         ],
    //         [
    //             [ -208.67698673219854, 82.56808791787034 ],
    //             [ -199.67698673219854, -273.43191208212966 ]
    //         ]
    //     ]);

    //     // for (let i=-180; i<=180; i += 10) {
    //     for (let i=-0; i<=0; i += 10) {
    //         const θ = i;
    //         const sinθ = sin(degToRad(θ));
    //         const cosθ = cos(degToRad(θ));
    //         const rot = rotate(sinθ, cosθ);

    //         const _pss_ = pss.map(ps => ps.map(rot));

    //         const principalAxes = getPrincipalAxes(_pss_);

    //         const { eigenValues, eigenVectors: [v1,v2] } = principalAxes;
    //         const θ1r = atan2(v1[1], v1[0]);
    //         const θ2r = atan2(v2[1], v2[0]);
    //         // const dotProd = dot(v1,v2);

    //         // eigenValues;
    //         const [θ1d,θ2d] = [θ1r,θ2r].map(radToDeg);

    //         sqrt(eigenValues[1])/sqrt(eigenValues[0]);
    //     }
    }
});
