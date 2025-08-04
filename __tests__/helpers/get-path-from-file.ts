import * as fs from 'fs';
import { getPathsFromStr } from '../../src/svg/get-paths-from-str';
import { Invariants } from './invariants';


function getPathFromFile(fileName: string) {
    let fileStr = fs.readFileSync(
        `c:/projects/boolean/__tests__/vectors/${fileName}.svg`, 'utf8'
    );

    let svgStr = fileStr.match(/d="[^"]*"/)![0];
    svgStr = svgStr.substring(3, svgStr.length-1);

    let invariantsStr = fileStr.match(/<!--[^>)]*>/)![0];
    invariantsStr = invariantsStr.substring(4, invariantsStr.length-3);
    let invariants: Invariants[][] = JSON.parse(invariantsStr);
    
    return {
        bezierLoops: getPathsFromStr(svgStr),
        invariants
    };
}


export { getPathFromFile }
