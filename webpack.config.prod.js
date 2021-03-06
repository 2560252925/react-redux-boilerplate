const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackCmCfg = require('./webpack.config.cm');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name]-[contenthash:8].css');

const config = {
    entry: {
        vendor: ['react', 'react-dom'],
        App: './src/index.jsx',
    },
    // 改用 CommonsChunkPlugin 插件
    // externals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM'
    // },
    // devtool: 'source-map',
    output: {
				filename: '[name]-[chunkhash:8].bundle.js',
        path: `${__dirname}/dist`,
        publicPath: './',
        chunkFilename: '[name].bundle.js',
        // sourceMapFilename: '[name]-[chunkhash:8].bundle.map',
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
            {
								test: /\.css$/i,
                use: extractCSS.extract({
										fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
														modules: true,
														sourceMap: true,
														minimize: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                        },
										}],
									//	publicPath: '/build'
                }),
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf|png|jpg|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2048, // 20K
                        fallback: 'file-loader', // default
                        name: '[name]-[hash:8].[ext]',
                        // publicPath: 'assets/',
                        outputPath: './imgs/',
                        useRelativePath: false, // true : outputPath 失效
                    },
                }],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        // 定义全局变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
						},
						__DEV__ :false
        }),
        // 抽离出公共模块到独立的js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', // 对应 entry
            filename: '[name]-[chunkhash:8].bundle.js',
            minChunks: Infinity,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './template/index.html',
            title: 'react-boilerplate',
            chunks: ['App', 'vendor'], // 指定要加入的entry实例,
            inject: 'body',
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                warnings: false,
            },
        }),
        // extractCSS,// 用到CSS的化，加上这个
        extractCSS,
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 10,
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map', // 请注意这里，不能写成[name].js.map,这种方式生成的map文件是个空文件
            exclude: ['vendor'],
				}),
				new CopyWebpackPlugin([{ from: './static/' ,to:'./'}]),
    ],

};

module.exports = Object.assign(WebpackCmCfg,config);
