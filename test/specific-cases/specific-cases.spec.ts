
import * as fs from 'fs';
import { assert, expect } from 'chai';
import { describe } from 'mocha';

import { getPathFromFile } from './get-path-from-file';
import { simplifyPaths } from '../../src/calc-paths/simplify-paths';
import { Invariants } from './invariants';
import { makeTolerance } from './make-tolerance';
import { checkShapes } from './check-shapes';


describe('specific cases', function() {
    let tolerancePower = -20;

    let fileName: string;
    
    testIt(
        'square',
        'simple square -> should decompose correctly (no decompisition)'
    );

    testIt(
        'multiple-xs-at-min-y',
        'multiple intersections at minimum y value -> should decompose correctly'
    );

    testIt(
        'complexish',
        'somewhat complex shape -> should decompose correctly'
    );

    testIt(
        'B',
        'B shape with quad beziers -> should decompose correctly'
    );

    testIt(
        'same-k-family-lines',
        'shape with overlapping beziers (lines) in same k family -> should decompose correctly'
    );

    testIt(
        'multi-level-reversed-orientation',
        'shape with multiple levels of both way oriented loops -> should decompose correctly'
    );

    testIt(
        'holy-poly',
        'polygon with 3 simple holes -> should decompose correctly'
    );
    
    testIt(
        'f',
        'f shape with interface intersections -> should decompose correctly'
    );

    testIt(
        'split-shape-lines',
        'split two shapes into two different shapes -> should decompose correctly'
    );

    testIt(
        'tiny-min-y-loop',
        'tiny loop at minimum y -> should decompose correctly'
    );

    testIt(
        'complex',
        'complex shape -> should decompose correctly'
    );

    let bezierLoops: number[][][][];
    let invariants: Invariants[][];

    function init(fileName_: string) { fileName = fileName_; }

    beforeEach(done => { 
        ({ bezierLoops, invariants } = getPathFromFile(fileName)); 
        done(); 
    });

    function testIt(fileName: string, description: string) {
        init(fileName);
        it(description, () => {
            let loopss = simplifyPaths(bezierLoops);
            let tolerance = makeTolerance(tolerancePower, bezierLoops);
            assert(
                checkShapes(loopss, invariants, tolerance),
                'invariants differ'
            );
        });
    }
});
