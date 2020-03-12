var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var config = require('./webpack.base.config.js');

config.output.path = require('path').resolve('./static/bundles/prod/');

config.plugins = config.plugins.concat([
    new BundleTracker({filename: './webpack-stats-prod.json'}),

    // removes a lot of debugging code in React
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production'),
            'BASE_API_URL': JSON.stringify('https://example.com/api/v1/'),
        }
    }),

    // keeps hashes consistent between compilations
    new webpack.optimize.OccurenceOrderPlugin()
])
;

config.optimization.minimizer = [new UglifyJsPlugin(),];


// Add a loader for JSX files
config.module.rules.push(
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {loader: 'babel'}
    }
);

module.exports = config;