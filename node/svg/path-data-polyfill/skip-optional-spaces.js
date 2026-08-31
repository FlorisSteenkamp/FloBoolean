import { isCurrentSpace } from './is-current-space.js';
function skipOptionalSpaces(source) {
    while (source._currentIndex < source._endIndex &&
        isCurrentSpace(source)) {
        source._currentIndex++;
    }
    return source._currentIndex < source._endIndex;
}
export { skipOptionalSpaces };
//# sourceMappingURL=skip-optional-spaces.js.map