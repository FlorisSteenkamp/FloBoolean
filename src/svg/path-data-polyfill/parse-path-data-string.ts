import { Source } from './source.js';


/**
 * @hidden
 * @param string 
 */
function parsePathDataString(string: string) {
    if (!string.length) { return []; }

    let source = new Source(string);
    let pathData = [];

    if (!source.initialCommandIsMoveTo()) { 
        throw new Error('Path must start with m or M'); 
    }

    while (source.hasMoreData()) {
        pathData.push(source.parseSegment());
    }

    return pathData;
}


export { parsePathDataString }
