
function AND(bits: boolean[]) { return (bits.every(v => v)); }
function OR(bits: boolean[]) { return (bits.includes(true)); }
/**
 * * for multiple inputs, XOR is typically defined such that the output is `true`
 * if an odd number of inputs are `true`, and `false` if an even number of inputs are `true`. 
 * 
 * @param bits 
 */
function XOR(bits: boolean[]) {
    return bits.filter(v => v).length%2 === 1;
}


export { AND, OR, XOR }
