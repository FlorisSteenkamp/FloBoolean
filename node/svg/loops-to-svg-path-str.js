import { beziersToSvgPathStr } from "./beziers-to-svg-path-str.js";
/**
 * Returns an SVG path string representation of the given bezier loops.
 *
 * @param loops An array of loops having an array of bezier curves each given as
 * an array of control points.
 */
function loopsToSvgPathStr(loops) {
    const strs = [];
    for (const loop of loops) {
        strs.push(beziersToSvgPathStr(loop));
    }
    return strs.join('\n');
}
export { loopsToSvgPathStr };
// Quokka tests
// const loops = [
//     [
//         [[483, 860], [-147, 758], [568, 541]],
//         [[568, 541], [208, 765], [483, 860]]
//     ],
//     [
//         [[306, 975], [901, 702], [342, 306]],
//         [[342, 306], [669, 653], [306, 975]]
//     ]
// ];
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
const str = loopsToSvgPathStr(loops); //?
//# sourceMappingURL=loops-to-svg-path-str.js.map