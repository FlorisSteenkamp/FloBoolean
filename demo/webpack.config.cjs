const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

const extensions = [
    '.js', '.mjs', '.cjs', 
    '.jsx', '.cjsx', '.mjsx'
];

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: './src/app.tsx',
    devtool: 'eval-source-map',
    resolve: {
        extensions,
        plugins: [new ResolveTypeScriptPlugin({
            includeNodeModules: false
        })]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    stats: {
        // Don't display anything, then add back colors, ...
        all: false,
        colors: true,
        errors: true,
        builtAt: true
    },
    plugins: [
        /*
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        })
        */
    ],
    optimization: {
        minimize: false
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: { type: 'module' }
    },
    experiments: {
        outputModule: true
    }
};