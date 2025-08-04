import { simplifyPaths } from '../src/calc-paths/simplify-paths';
import { getPathsFromStr } from '../src/svg/get-paths-from-str';


test('options', function() {
    {
        // Two overlapping squares
        const pathStr = `
                M 0, 0   L 2, 0   L 2, 2   L 0, 2   Z
                M 1, 1   L 3, 1   L 3, 3   L 1, 3   Z
        `;

        const _loopss = getPathsFromStr(pathStr);
        const loopss_ = simplifyPaths(_loopss);

        const _l0 = _loopss[0];//?
        const _l1 = _loopss[1];//?
        const l_ = loopss_[0][0].beziers;//?
        
        expect(_l[0][0] === l_[0][1]).toBe(true);
    }

    {
        // shape with topmost not at interface
        const pathStr = `M 0 0   Q 2 1 2 0  Z`;

        const _loopss = getPathsFromStr(pathStr);
        const loopss_ = simplifyPaths(_loopss);

        const _l = _loopss[0];
        const l_ = loopss_[0][0].beziers;

        expect(_l[0][0] === l_[0][1]).toBe(true);
        expect(_l[0][0] === l_[1][0]).toBe(true);
        expect(_l[0][1] === l_[1][1]).toBe(true);
        expect(_l[0][2] === _l[1][0]).toBe(true);
        expect(_l[0][2] === l_[1][2]).toBe(true);
    }


    // expect(v).toStrictEqual(v_);
});