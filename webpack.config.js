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
    },
    progress_util: {
        test: require.resolve('./JSDO/src/progress.util.js'),
        use: 'imports-loader?progress=>window.progress'
    },
    progress_session: {
        test: require.resolve('./JSDO/src/progress.session.js'),
        use: 'imports-loader?progress=>window.progress'
    },
    progress: {
        test: require.resolve('./JSDO/src/progress.js'),
        use: 'imports-loader?progress=>window.progress'
    },
    progress_auth: {
        test: require.resolve('./JSDO/src/auth/progress.auth.js'),
        use: 'imports-loader?progress=>window.progress'
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
            rules.js,
            rules.ts,
            rules.styles
            // rules.progress_util,
            // rules.progress_session,
            // rules.progress,
            // rules.progress_auth
        ]
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'progress.loader': path.resolve(__dirname, './lib/progress.loader')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
        }
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
        }),
        new webpack.ProvidePlugin({
            'progress': 'progress.loader'
        })
    ],
    bail: true
};
