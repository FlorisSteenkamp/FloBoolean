function xsHasMinY(xs) {
    for (let _x_ of xs) {
        if (_x_.x.kind === 0) {
            return true;
        }
    }
    return false;
}
export { xsHasMinY };
//# sourceMappingURL=xs-has-min-y.js.map