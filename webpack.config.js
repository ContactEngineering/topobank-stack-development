const path = require('path');
const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: {
        app: 'topobank/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'static/js'),
        filename: '[name].bundle.js',
        library: ['topobank', '[name]']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        alias: {
            topobank: path.resolve(__dirname, 'ce-ui/frontend'),
            topobank_statistics: path.resolve(__dirname, 'topobank-statistics/frontend'),
            topobank_contact: path.resolve(__dirname, 'topobank-contact/frontend')
        },
        extensions: [
            '.js',
            '.ts',
            '.scss',
            '.vue'
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
