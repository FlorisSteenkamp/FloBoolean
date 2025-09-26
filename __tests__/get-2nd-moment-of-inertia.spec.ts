import { ddToStr } from 'double-double';
import { rotate } from "flo-vector2d";
import { degToRad, radToDeg } from '../src/svg/circle-to-cubic-beziers.js';
import { getShapeCentroid } from '../src/loop/get-loop-centroid.js';
import { reverseShapeOrientation } from "../src/loop/reverse-shape-orientation.js";
import { get2ndMomentOfInertia, getProdMomentOfInertia, ddGet2ndMomentOfInertia, ddGetProdMomentOfInertia } from '../src/loop/get-2nd-moment-of-inertia.js';

const { PI, sin, cos } = Math;


test('get2ndMomentOfInertia', function() {
    {
        //----------------
        // Some rectangle
        //----------------
        const pss: number[][][] = reverseShapeOrientation([
            [[0,0], [0,8]],
            [[0,8], [1,8]],
            [[1,8], [1,0]],
            [[1,0], [0,0]]
        ]);
        const c = getShapeCentroid(pss);
        const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

        const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);
        const Ixy = getProdMomentOfInertia(pss_);
        const [_Ixx, _Iyy] = ddGet2ndMomentOfInertia(pss_);

        // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
        const Ixx_ = (1*(8**3))/12;
        const Iyy_ = ((1**3)*8)/12;

        expect(Ixx).toBeCloseTo(Ixx_, 13);
        expect(Iyy).toBeCloseTo(Iyy_, 13);

        expect(Ixy).toStrictEqual(0);
    }


    {
        //-------------
        // Unit circle
        //-------------
        const C = 0.5519150244935105707435627

        const pss = reverseShapeOrientation([
            [[0,1], [C,1], [1,C], [1,0]],  // quarter circle
            [[1,0], [1,-C], [C,-1], [0,-1]],
            [[0,-1], [-C,-1], [-1,-C], [-1,0]],
            [[-1,0], [-1,C], [-C,1], [0,1]],
        ]);
        
        const c = getShapeCentroid(pss);
        const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

        const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);
        const Ixy = getProdMomentOfInertia(pss_);
        
        const [_Ixx, _Iyy] = ddGet2ndMomentOfInertia(pss_);

        // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
        const Ixx_ = PI/4;
        const Iyy_ = PI/4;

        expect(Ixx).toBeCloseTo(_Ixx[1], 13);
        expect(Iyy).toBeCloseTo(_Iyy[1], 13);
        expect(Ixx).toBeCloseTo(Ixx_, 3);  // the bezier loop only approximates a circle
        expect(Iyy).toBeCloseTo(Iyy_, 3);

        expect(Ixy).toStrictEqual(0);
    }

    {
        //--------------
        // Some ellipse
        //--------------
        const C = 0.5519150244935105707435627;

        const pss = reverseShapeOrientation([
            [[0,1], [C/3,1], [1/3,C], [1/3,0]],  // quarter circle
            [[1/3,0], [1/3,-C], [C/3,-1], [0,-1]],
            [[0,-1], [-C/3,-1], [-1/3,-C], [-1/3,0]],
            [[-1/3,0], [-1/3,C], [-C/3,1], [0,1]],
        ]);
        
        const c = getShapeCentroid(pss);
        const _pss = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

        const θ = 6;
        const sinθ = sin(degToRad(θ));
        const cosθ = cos(degToRad(θ));
        const rot = rotate(sinθ, cosθ);

        const pss_ = _pss.map(ps => ps.map(rot));

        const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);
        const [_Ixx, _Iyy] = ddGet2ndMomentOfInertia(pss_);
        const Ixy = getProdMomentOfInertia(pss_);
        const Ixy_ = ddGetProdMomentOfInertia(pss_);
        
        // ddToStr(_Ixx);
        // ddToStr(_Iyy);
        // ddToStr(Ixy_);

        // As https://en.wikipedia.org/wiki/List_of_second_moments_of_area
        const Ixx_ = (PI/4)*(1/3)*(1**3);
        const Iyy_ = (PI/4)*((1/3)**3)*(1);

        expect(Ixx).toBeCloseTo(_Ixx[1], 13);
        expect(Iyy).toBeCloseTo(_Iyy[1], 13);
        expect(Ixx).toBeCloseTo(Ixx_, 2);  // the bezier loop only approximates a circle
        expect(Iyy).toBeCloseTo(Iyy_, 2);

        expect(Ixy).toBeCloseTo(-0.024195279907715816, 13);
        expect(Ixy_[1]).toBeCloseTo(-0.024195279907715816, 13);
    }


    {
        //--------
        // Square
        //--------
        const pss: number[][][] = reverseShapeOrientation([
            [[0,0], [0,1]],
            [[0,1], [1,1]],
            [[1,1], [1,0]],
            [[1,0], [0,0]]
        ]);
        const c = getShapeCentroid(pss);
        const pss_ = pss.map(ps => ps.map(p => [p[0] - c[0], p[1] - c[1]]));

        const [Ixx, Iyy] = get2ndMomentOfInertia(pss_);
        const Ixy = getProdMomentOfInertia(pss_);

        const Ixx_ = 1/12;
        const Iyy_ = 1/12;

        expect(Ixx).toBeCloseTo(Ixx_, 15);
        expect(Iyy).toBeCloseTo(Iyy_, 15);

        expect(Ixy).toStrictEqual(0);
    }
});
