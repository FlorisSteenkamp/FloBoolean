
interface BooleanOptions {
    /**  */
    readonly inclMicroCorners?: boolean;
    /**
     * * defaults to `(2**expMax * 2**(-12))**2`;
     * * minimum area of a bezer loop before it will be discarded
     */
    readonly minLoopArea?: number;
    /**
     * defaults to `false` (for historic reasons); if `true` then the returned
     * paths all have a positive (counter-clockwise) orientation for each single
     * outermost loop (with the set of returned loops) with the rest being negatively
     * oriented, else, if `false` the reverse is true.
     */
    readonly orientationPositive?: boolean;
    /**
     * defaults to `false` (for historic reasons);
     */
    readonly keepOriginalOrientation?: boolean;
}


export type { BooleanOptions }
