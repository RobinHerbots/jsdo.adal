'use strict';

var webpack = require('webpack'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    path = require('path');

function _path(p) {
    return path.join(__dirname, p);
}

function createBanner() {
    return "[name]\n" +
        "<%= pkg.homepage %>\n" +
        "Copyright (c) 2010 - <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
        "Licensed under the <%= pkg.license %> license\n" +
        "Version: <%= pkg.version %>";
}

var rules = {
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
    entry: {
        "lib/progress.auth.adal": "./src/progress.auth.adal.js"
    },
    output: {
        path: __dirname,
        filename: "[name].js",
        libraryTarget: "umd"
    },
    optimization: {
        minimize: false,
        minimizer: [new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                warnings: "verbose",
                mangle: false,
                compress: {
                    keep_fnames: true,
                    unused: false,
                    typeofs: false,
                    dead_code: false,
                    collapse_vars: false
                },
                output: {
                    ascii_only: true,
                    beautify: true,
                    comments: /^!/
                }
            },
            extractComments: false
        })]
    },
    module: {
        rules: [
            rules.sourceMap,
            rules.js
        ]
    },
    devtool: "source-map",
    plugins: [
        new webpack.BannerPlugin({
            banner: createBanner(),
            entryOnly: true
        })
    ],
    bail: true,
    mode: "none"
};
