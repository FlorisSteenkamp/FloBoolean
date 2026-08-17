import type { Source } from './source.js';
import { skipOptionalSpaces } from './skip-optional-spaces.js';
import { isCurrentSpace } from './is-current-space.js';


/** * modifies `source` */
function skipOptionalSpacesOrDelimiter(
        source: Source): boolean {

    if (source._currentIndex < source._endIndex &&
        !isCurrentSpace(source) &&
        source._string[source._currentIndex] !== ","
    ) {
        return false;
    }

    if (skipOptionalSpaces(source)) {
        if (source._currentIndex < source._endIndex &&
            source._string[source._currentIndex] === ",") {

            source._currentIndex++;
            skipOptionalSpaces(source);
        }
    }

    return source._currentIndex < source._endIndex;
}


export { skipOptionalSpacesOrDelimiter }
