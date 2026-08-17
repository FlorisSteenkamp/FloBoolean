import type { Source } from './source.js';
import { hasMoreData } from './has-more-data.js';
import { toCommand } from './to-command.js';


function initialCommandIsMoveTo(
        source: Source): boolean {

    // If the path is empty it is still valid, so return true.
    if (!hasMoreData(source)) {
        return true;
    }

    const command = toCommand(source._string[source._currentIndex]);

    return command === "M" || command === "m";
}


export { initialCommandIsMoveTo }
