declare global {
    namespace jest {
        interface Matchers<R, T = {}> {
            /**
             * @param ulps If a number then 2**1 means last bit, 2**2 means last 2 bits, etc...
             * else if an array containing a single number then 1 means 1 eps, 2 means 2 eps, etc...
             * @param msg optional message prepended to the failure output
             */
            toBeNearly(ulps: number | number[], value: T, msg?: string): R;
        }
    }
}


declare module 'expect' {
    interface Matchers<R extends void | Promise<void>, T = unknown> {
        /**
         * @param ulps If a number then 2**1 means last bit, 2**2 means last 2 bits, etc...
         * else if an array containing a single number then 1 means 1 eps, 2 means 2 eps, etc...
         * @param msg optional message prepended to the failure output
         */
        toBeNearly(ulps: number | number[], value: T, msg?: string): R;
    }
}


declare module '@jest/expect' {
    interface Matchers<R extends void | Promise<void>, T = unknown> {
        /**
         * @param ulps If a number then 2**1 means last bit, 2**2 means last 2 bits, etc...
         * else if an array containing a single number then 1 means 1 eps, 2 means 2 eps, etc...
         * @param msg optional message prepended to the failure output
         */
        toBeNearly(ulps: number | number[], value: T, msg?: string): R;
    }
}

export {};