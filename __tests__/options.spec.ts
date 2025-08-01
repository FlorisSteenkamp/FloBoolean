import * as fs from 'fs';
import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { simplifyPaths } from '../src/calc-paths/simplify-paths';


test('options', function() {
    let bezierLoops: number[][][][];

    // Two overlapping squares
    const bz11 = [[0,0],[2,0]];
    const bz12 = [[2,0],[2,2]];
    const bz13 = [[2,2],[0,2]];
    const bz14 = [[0,2],[0,0]];

    const bz21 = [[1,1],[3,1]];
    const bz22 = [[3,1],[3,3]];
    const bz23 = [[3,3],[1,3]];
    const bz24 = [[1,3],[1,1]];

    const loop1 = [bz11, bz12, bz13, bz14];
    const loop2 = [bz21, bz22, bz23, bz24];

    const loopss = simplifyPaths([loop1, loop2]);
    loopss;
    const loops = loopss[0];
    loops.length;//?
    const beziers = loops[0].beziers;
    beziers;//?

    // expect(v).toStrictEqual(v_);
});