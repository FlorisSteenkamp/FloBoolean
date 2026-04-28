import type { Curve } from './curve/curve.js';


interface Maps {
    bezier: {
        toCurve: Map<number[][], Curve>;
    }
}


export type { Maps }
