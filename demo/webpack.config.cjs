// const CircularDependencyPlugin = require('circular-dependency-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: './src/app.tsx',
    devtool: 'eval-source-map',
    resolve: {
        extensions: [
            '.js', '.mjs', '.cjs', 
            '.jsx', '.cjsx', '.mjsx',
            '.tsx', '.ts', '.d.ts'
        ],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        },
        alias: {}
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: { silent: true },
            exclude: /node_modules/,
            sideEffects: false
        }]
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