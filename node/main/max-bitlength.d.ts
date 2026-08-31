/**
 * All bezier coordinates will be truncated to this (bit-aligned) bitlength.
 * Higher bitlengths would increase the running time of the algorithm
 * considerably in the worst cases.
 */
declare const MAX_BIT_LENGTH = 46;
export { MAX_BIT_LENGTH };
