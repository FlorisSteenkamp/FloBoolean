
const esModules = [
    'flo-bezier3', 'flo-graham-scan',
    'flo-poly', 'flo-gauss-quadrature',
    'flo-vector2d', 'big-float-ts', 'double-double',
    'flo-memoize'
].join('|');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    moduleFileExtensions: ['ts', 'js'],
    resolver: "jest-ts-webcompat-resolver",
    // preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [ "**/__tests__/**/*.spec.ts"],
    // collectCoverage: true,
    collectCoverage: false,  // Make true again!
    coverageProvider: 'v8',
    testTimeout: 15000,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest"
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        // '^.+\\.tsx?$': [
        //   'ts-jest',
        //   {
        //     isolatedModules: true,
        //   },
        // ],
    },
    transformIgnorePatterns: [
        `/node_modules/(?!${esModules})`
    ],
};