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
    },
    ts: {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /(node_modules)/
    },
    styles: {
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: function () {
                        return [
                            require('postcss-cssnext')
                        ];
                    }
                }
            }
        ]
    }
}

module.exports = {
    entry: "./lib/progress.auth.adal.js",
    output: {
        path: __dirname,
        filename: "./dist/progress.auth.adal.js"
    },
    externals: {
        "jquery": "jQuery",
        "progress": "progress"
    },
    module: {
        rules: [
            rules.sourceMap,
            rules.js,
            rules.ts,
            rules.styles
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
    bail: true,
    // devServer: {
    // 	publicPath: '/',
    // 	stats: {
    // 		colors: true
    // 	},
    // 	host: '0.0.0.0',
    // 	inline: true,
    // 	port: '8080',
    // 	quiet: false,
    // 	noInfo: false,
    // },
};
