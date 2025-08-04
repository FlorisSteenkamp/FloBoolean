import { Source } from './source';
/**
 * @hidden
 * @param string
 */
function parsePathDataString(string) {
    if (!string.length) {
        return [];
    }
    const source = new Source(string);
    const pathData = [];
    if (!source.initialCommandIsMoveTo()) {
        throw new Error('Path must start with m or M');
    }
    while (source.hasMoreData()) {
        pathData.push(source.parseSegment());
    }
    return pathData;
}
export { parsePathDataString };
//# sourceMappingURL=parse-path-data-string.js.map