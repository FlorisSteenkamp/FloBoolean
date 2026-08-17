import type { Source } from './source.js';
import { isCurrentSpace } from './is-current-space.js';


function skipOptionalSpaces(
        source: Source): boolean {

    while (source._currentIndex < source._endIndex &&
           isCurrentSpace(source)) {

        source._currentIndex++;
    }

    return source._currentIndex < source._endIndex;
}


export { skipOptionalSpaces }
