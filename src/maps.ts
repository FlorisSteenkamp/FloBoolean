import { Curve } from './curve/curve';


interface Maps {
    bezier: {
        toCurve: Map<number[][], Curve>;
    }
}


export { Maps }
