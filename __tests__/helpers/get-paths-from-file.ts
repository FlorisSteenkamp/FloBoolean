import * as fs from 'fs';
import type { Invariants } from './invariants';
import { getPathsFromStr } from '../../src/svg/get-paths-from-str';
import { getPaths } from '../../demo/src/page/load-paths.js';


function getPathsFromFile(fileName: string) {
    let str = fs.readFileSync(
        `c:/projects/boolean/demo/vectors-boolean/${fileName}.svg`, 'utf8'
    );

    const pathStrs = getPaths(str);
    const bezierLoopss = pathStrs.map(getPathsFromStr);

    let svgStr = str.match(/d="[^"]*"/)![0];
    svgStr = svgStr.substring(3, svgStr.length-1);

    // let invariantsStr = fileStr.match(/<!--[^>)]*>/)![0];
    // invariantsStr = invariantsStr.substring(4, invariantsStr.length-3);
    // let invariants: Invariants[][] = JSON.parse(invariantsStr);
    
    return {
        bezierLoopss,
        // invariants
    };
}



export { getPathsFromFile }
