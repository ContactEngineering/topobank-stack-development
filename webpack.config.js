const webpack = require('webpack');
const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: {
        base: 'topobank/manager/base.js',
        select: 'topobank/manager/select.js',
        dzi: 'topobank/manager/dzi.js',
        series_card: 'topobank/analysis/series_card.js',
        roughness_parameters_card: 'topobank_statistics/analysis/roughness_parameters_card.js'
    },
    output: {
        path: path.resolve(__dirname, 'topobank/topobank/static/js'),
        filename: '[name].bundle.js',
        library: ['topobank', '[name]']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            topobank: path.resolve(__dirname, 'topobank/topobank/frontend'),
            topobank_statistics: path.resolve(__dirname, 'topobank-statistics/topobank_statistics/frontend'),
            topobank_contact: path.resolve(__dirname, 'topobank-contact/topobank_contact/frontend')
        },
        extensions: [
            '.js',
            '.vue'
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
