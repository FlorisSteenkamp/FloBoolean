import { test, expect } from '@jest/globals';
import { loopsToSvgPathStr } from '../../src/svg/loops-to-svg-path-str.ts';


test('loopsToSvgPathStr - two loops of quadratic beziers', () => {
    const loops = [
        [
            [[483, 860], [-147, 758], [568, 541]],
            [[568, 541], [208, 765], [483, 860]]
        ],
        [
            [[306, 975], [901, 702], [342, 306]],
            [[342, 306], [669, 653], [306, 975]]
        ]
    ];

    expect(loopsToSvgPathStr(loops)).toBe([
        'M 483 860',
        'Q -147 758 568 541 ',
        'Q 208 765 483 860 ',
        ' z',
        'M 306 975',
        'Q 901 702 342 306 ',
        'Q 669 653 306 975 ',
        ' z',
    ].join('\n'));
});


test('loopsToSvgPathStr - two loops mixing lines and quadratic beziers', () => {
    const loops = [
        [
            [[667, 745], [482, 748]],
            [[482, 748], [479, 677], [480, 535]],
            [[480, 535], [659, 543]],
            [[659, 543], [484, 650], [667, 745]]
        ],
        [
            [[516, 781], [705, 782]],
            [[705, 782], [770, 680], [700, 518]],
            [[700, 518], [496, 504]],
            [[496, 504], [713, 639], [516, 781]]
        ]
    ];

    expect(loopsToSvgPathStr(loops)).toBe([
        'M 667 745',
        'L 482 748 ',
        'Q 479 677 480 535 ',
        'L 659 543 ',
        'Q 484 650 667 745 ',
        ' z',
        'M 516 781',
        'L 705 782 ',
        'Q 770 680 700 518 ',
        'L 496 504 ',
        'Q 713 639 516 781 ',
        ' z',
    ].join('\n'));
});
