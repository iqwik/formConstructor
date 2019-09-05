const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev_path = 'dev';
const prod_path = 'app';


module.exports = {

    entry: {
        app: './index.js',
    },
    context: `${__dirname}/${dev_path}`,
    output: {
        path: `${__dirname}/${prod_path}/`,
        filename: NODE_ENV === 'development' ? '[name].js' : 'js/[name]_[hash:6].min.js',
        publicPath: `/${prod_path}/`,
    },

    optimization: {
        minimize: NODE_ENV !== 'development',
    },

    plugins: [
        new webpack.DefinePlugin({ __IS_DEV__: NODE_ENV === 'development' }),
        new HtmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: NODE_ENV === 'development' ? 'css/[name].css' : `css/[name].[hash:6].css`,
            chunkFilename: NODE_ENV === 'development' ? 'css/[id].css' : `css/[id].[hash:6].css`,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: `${__dirname}/${dev_path}`,
                loader: 'babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-1',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded',
            },
        ],
    },

    resolve: {
        modules: [`${__dirname}/${dev_path}`, 'node_modules'],
        extensions: ['.js', '.jsx'],
    },

    watch: NODE_ENV === 'development',
    watchOptions: {
        aggregateTimeout: 100,
    },

    devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : false,
};