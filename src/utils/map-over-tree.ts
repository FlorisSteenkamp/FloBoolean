import type { InOut } from '../containers/in-out/in-out.js';


/** For debugging only */
function mapOverTree<T extends { children?: T[] | undefined }>(
        root: InOut,
        f: (inOut: InOut) => T) {

    const t = f(root);
    t.children = root.children
        ? Array.from(root.children!).map(v => mapOverTree(v,f))
        : undefined;

    return t;
}


export { mapOverTree }
