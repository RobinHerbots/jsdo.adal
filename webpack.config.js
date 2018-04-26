'use strict';

let webpack = require('webpack');
let path = require('path');

function _path(p) {
    return path.join(__dirname, p);
}

const rules = {
    sourceMap: {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
    },
    js: {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
            presets: [
                'env'
            ],
            passPerPreset: true,
        },
    }
}

module.exports = {
    entry: "./lib/progress.auth.adal.js",
    output: {
        path: __dirname,
        filename: "./dist/progress.auth.adal.js"
    },
    externals: {
        "window": "window",
        "jquery": "jQuery"
    },
    module: {
        rules: [
            rules.sourceMap,
            rules.js
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            // file and reference
            filename: '[file].map',
            // sources naming
            moduleFilenameTemplate: '[absolute-resource-path]',
            fallbackModuleFilenameTemplate: '[absolute-resource-path]',
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ],
    bail: true
};
