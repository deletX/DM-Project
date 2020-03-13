var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var config = require('./webpack.base.config.js');

config.entry.App = [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/App.jsx',
];

config.output.publicPath = 'http://localhost:3000' + '/assets/bundles/'

config.devtool = "#eval-source-map";

config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({filename: './webpack-stats-local.json'}), // in the local dev machine we want to add the BundleTracker plugin.
]);

config.module.rules.push(
    {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
            {loader: 'react-hot-loader/webpack'},
            {loader: 'babel-loader'},
        ]
    }
);

config.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000

};

module.exports = config;