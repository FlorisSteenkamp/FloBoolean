
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
    // testEnvironment: 'node',
    testEnvironment: 'jsdom',
    testMatch: [ "**/__tests__/**/*.spec.ts"],
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