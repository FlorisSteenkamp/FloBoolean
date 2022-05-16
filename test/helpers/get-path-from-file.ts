import * as fs from 'fs';
import { getPathsFromStr } from '../../src/svg/get-paths-from-str.js';
import { Invariants } from './invariants.js';


function getPathFromFile(fileName: string) {
    let fileStr = fs.readFileSync(
        `c:/projects/boolean/test/vectors/${fileName}.svg`, 'utf8'
    );

    let svgStr = fileStr.match(/d="[^"]*"/)![0];
    svgStr = svgStr.substring(3, svgStr.length-1);

    let invariantsStr = fileStr.match(/<!--[^>)]*>/)![0];
    invariantsStr = invariantsStr.substring(4, invariantsStr.length-3);
    //console.log(invariantsStr);
    let invariants: Invariants[][] = JSON.parse(invariantsStr);
    
    return {
        bezierLoops: getPathsFromStr(svgStr),
        invariants
    };
}


export { getPathFromFile }
