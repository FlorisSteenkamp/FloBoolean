import type { Segment } from '../path-segment/segment.js';
import type { Source } from './source.js';
import { parseSegment } from './parse-segment.js';
import { hasMoreData } from './has-more-data.js';
import { initialCommandIsMoveTo } from './initial-command-is-move-to.js';
import { skipOptionalSpaces } from './skip-optional-spaces.js';


/**
 * @param str 
 * 
 * @internal
 */
function parsePathDataString(
        str: string) {

    if (!str.length) { return []; }

    const source: Source = {
        _string: str,
        _currentIndex: 0,
        _endIndex: str.length,
        _prevCommand: undefined
    };
    skipOptionalSpaces(source);

    if (!initialCommandIsMoveTo(source)) { 
        throw new Error('Path must start with m or M'); 
    }

    const pathData: Segment[] = [];
    while (hasMoreData(source)) {
        pathData.push(parseSegment(source));
    }

    return pathData;
}


export { parsePathDataString }
