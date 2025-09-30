import { Loop } from "./loop";
/**
 * @param beziers a pre-ordered array of bezier curves to add initially.
 * @param idx an optional index to assign to the loop - it can be anything
 */
declare function loopFromBeziers(beziers: number[][][] | undefined, idx: number): Loop;
export { loopFromBeziers };
