const pkg = require('../package');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                                minimize: true,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                // Necessary for external CSS imports to work
                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9', // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },
                    ]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                                minimize: true,
                                modules:true
                            }
                        },
                        {
                            loader: require.resolve('less-loader'),
                            options:{
                                sourceMap: true,
                                modifyVars: pkg.theme
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [ {
                    loader: 'url-loader',
                    options: {
                        limit:10000,
                        outputPath:"static/",
                    }
                }]
            },
        ]
    },
    plugins:[
        new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css',
        }),
        new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
        ]
};