import type { Source } from './source.js';
import { skipOptionalSpacesOrDelimiter } from './skip-optional-spaces-or-delimiter.js';


/** * modifies `source` */
function parseArcFlag(
        source: Source): number {

    if (source._currentIndex >= source._endIndex) {
        throw new Error('Unable to parse arc flag');
    }

    let flag: number | undefined = undefined;
    const flagChar = source._string[source._currentIndex];

    source._currentIndex++;

    if (flagChar === "0") {
        flag = 0;
    } else if (flagChar === "1") {
        flag = 1;
    } else {
        throw new Error('Unable to parse arc flag - arc flag must be 0 or 1');
    }

    skipOptionalSpacesOrDelimiter(source);

    return flag;
}


export { parseArcFlag }
