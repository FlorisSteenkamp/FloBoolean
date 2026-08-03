
const esModules = [
    'flo-bezier3', 'flo-graham-scan',
    'flo-poly', 'flo-gauss-quadrature',
    'flo-vector2d', 'big-float-ts', 'double-double',
    'flo-memoize', 'squares-rng', 'flo-draw'
].join('|');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    moduleFileExtensions: ['ts', 'js'],
    resolver: "jest-ts-webcompat-resolver",
    testEnvironment: 'node',
    // testEnvironment: 'jsdom',
    verbose: false,  // show a per-file summary instead of each individual test
    // Only report failing tests/suites (stay silent for passes). Pass
    // `showPaths: true` in the options below to also list passing file paths.
    reporters: [
        ['jest-silent-reporter', { useDots: true, showWarnings: true }],
        './jest-console-reporter.cjs',
        'summary',
    ],
    testMatch: [ "**/__tests__/**/*.spec.ts"],
    setupFiles: [ './jest.setup.getorinsert.cjs' ],
    // collectCoverage: true,
    collectCoverage: false,  // Make true again!
    coverageProvider: 'v8',
    testTimeout: 15000,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest"
    },
    transformIgnorePatterns: [
        `/node_modules/(?!${esModules})`
    ],
};