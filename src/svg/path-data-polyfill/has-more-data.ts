import type { Source } from './source.js';


function hasMoreData(
        source: Source): boolean {

    return source._currentIndex < source._endIndex;
}


export { hasMoreData }
