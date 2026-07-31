import * as fs from 'fs';
import { getPathsFromStr } from '../../src/svg/get-paths-from-str.js';
import { Invariants } from './invariants.js';


function getPathFromFile(
        fileName: string) {

    let fileStr = fs.readFileSync(
        `c:/projects/boolean/demo/vectors/${fileName}.svg`, 'utf8'
    );

    let svgStr = fileStr.match(/d="[^"]*"/)![0];
    svgStr = svgStr.substring(3, svgStr.length-1);

    let invariants: Invariants[][] = [];
    const invariantsStrs = fileStr.match(/<!--[^>)]*>/)!;
    if (!!invariantsStrs && invariantsStrs.length > 0) {
        const invariantsStr = invariantsStrs[0].substring(4, invariantsStrs[0].length-3);
        invariants = JSON.parse(invariantsStr);
    }
    
    return {
        bezierLoops: getPathsFromStr(svgStr),
        invariants
    };
}


export { getPathFromFile }
