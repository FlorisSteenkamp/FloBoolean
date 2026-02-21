import type { InOut } from '../containers/in-out/in-out.js';
/** For debugging only */
declare function mapOverTree<T extends {
    children?: T[] | undefined;
}>(root: InOut, f: (inOut: InOut) => T): T;
export { mapOverTree };
