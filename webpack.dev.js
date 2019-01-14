var merge = require('webpack-merge');
var common = require('./webpack.common');
var glob = require("glob");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

console.log("Development running")
module.exports = merge(common, {
    output: {
        filename: 'scripts/[name]/bundle.js'
    },
    plugins: [
        new ExtractTextPlugin({ // define where to save the file
            filename: 'style/[name]/bundle.css',
            allChunks: true,
        }),
    ],
});

