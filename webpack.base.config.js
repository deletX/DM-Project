var path = require("path");
var webpack = require('webpack');

module.exports = {
    context: __dirname,

    entry: {
        // Add as many entry points as you have container-react-components here
        App: './src/components/App.jsx',
        vendors: ['react'],
    },

    output: {
        path: path.resolve('./assets/bundles/local/'),
        filename: "[name]-[hash].js"
    },

    externals: [], // add all vendor libs

    plugins: [], // add all common plugins here

    module: {
        rules: []
    },

    resolve: {
        modules: ["node_modules", "bower_components"],
        extensions: ['.js', '.jsx']
    },

    optimization: {
        splitChunks: {}
    }
};