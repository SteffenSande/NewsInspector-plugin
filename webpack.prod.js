const merge = require('webpack-merge');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

console.log("Production build");

const name = "NewsEnhancer";

function folder(path) {
    if (typeof path === "undefined" || path === null)
        return name + "/";
    return name + "/" + path;
}

module.exports = merge(common, {
    output: {
        filename: folder('scripts/[name]/bundle.js')
    },

    plugins: [
        new CopyWebpackPlugin([
            {from: './html', to: folder('html')},
            {from: './icons', to: folder('icons')},
            {from: './manifest.json', to: folder() },
            {from: './style/fonts', to: folder('style/fonts') }
        ]),
        new UglifyJSPlugin(),
        new ExtractTextPlugin({ // define where to save the file
            filename: folder('style') + '/[name]/bundle.css',
            allChunks: true
        })
    ]
});

