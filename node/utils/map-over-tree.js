/** For debugging only */
function mapOverTree(root, f) {
    const t = f(root);
    t.children = root.children
        ? Array.from(root.children).map(v => mapOverTree(v, f))
        : undefined;
    return t;
}
export { mapOverTree };
//# sourceMappingURL=map-over-tree.js.map