// SVG path grammar whitespace (wsp): space, tab, LF, CR, FF
const WHITESPACE_RE = /[ \t\n\r\f]/;
function isCurrentSpace(source) {
    return WHITESPACE_RE.test(source._string[source._currentIndex]);
}
export { isCurrentSpace };
//# sourceMappingURL=is-current-space.js.map