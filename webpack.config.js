const path = require('path');
const webpack = require('webpack');
const {ModuleFederationPlugin} = require('webpack').container;
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: {
        base: 'topobank/manager/base.js',
        series_card: {
            import: 'topobank/analysis/series_card.js',
            dependOn: 'base'
        },
        roughness_parameters_card: {
            import: 'topobank_statistics/roughness_parameters_card.js',
            dependOn: 'base'
        },
        contact_mechanics_card: {
            import: 'topobank_contact/contact_mechanics_card.js',
            dependOn: 'base'
        }
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
                test: /\.s[ac]ss$/,
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
            '.scss',
            '.vue'
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new ModuleFederationPlugin({
            shared: {
                '@bokeh/bokehjs': {singleton: true, eager: true},
                bootstrap: {singleton: true, eager: true},
                jquery: {singleton: true, eager: true},
                vue: {singleton: true, eager: true}
            }
        })
    ]
};
