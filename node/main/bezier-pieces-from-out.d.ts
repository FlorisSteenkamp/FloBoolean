import type { BezierPiece } from "flo-bezier3";
import type { Out } from "../containers/in-out/in-out.js";
declare const bezierPiecesFromOut$: ((out: Out) => BezierPiece[]) & {
    readonly weakMapS: WeakMap<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly mapS: Map<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly clearCache: () => void;
    readonly addToCache: (r: unknown, ...args: any) => void;
};
export { bezierPiecesFromOut$ };
