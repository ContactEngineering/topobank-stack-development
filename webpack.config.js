const path = require('path');
const webpack = require('webpack');
const {ModuleFederationPlugin} = require('webpack').container;
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: {
        base: 'topobank/manager/base.js',
        analysis_app: {
            import: 'topobank/analysis/analysis_app.js',
            dependOn: 'base'
        },
        surface_detail_app: {
            import: 'topobank/manager/surface_detail_app.js',
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
            config: path.resolve(__dirname, 'config'),
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
                '@bokeh/bokehjs': {singleton: true, eager: true, requiredVersion: '3.0.3'},
                bootstrap: {singleton: true, eager: true},
                jquery: {singleton: true, eager: true},
                vue: {singleton: true, eager: true, requiredVersion: '3.3.4'}
            }
        })
    ]
};
