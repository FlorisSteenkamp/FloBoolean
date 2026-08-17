import type { Source } from './source.js';


// SVG path grammar whitespace (wsp): space, tab, LF, CR, FF
const WHITESPACE_RE = /[ \t\n\r\f]/;

function isCurrentSpace(
        source: Source): boolean {

    return WHITESPACE_RE.test(source._string[source._currentIndex]);
}


export { isCurrentSpace }
