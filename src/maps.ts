import { Curve } from './curve/curve.js';


interface Maps {
    bezier: {
        toCurve: Map<number[][], Curve>;
    }
}


export { Maps }
