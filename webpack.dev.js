const merge = require("webpack-merge");
const common = require("./webpack.common");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

console.log("Development running");

const name = "NewsInspector";

function folder(path) {
    if (typeof path === "undefined" || path === null) return name + "/";
    return name + "/" + path;
}



module.exports = merge(common, {
    output: {
        filename: folder("scripts/[name]/bundle.js"),
        path: path.resolve("", __dirname)

    },
    plugins: [
        new CopyWebpackPlugin([
            {from: "./html", to: folder("html")},
            {from: "./icons", to: folder("icons")},
            {from: "./manifest.json", to: folder()},
            {from: "./styles/fonts", to: folder("styles/fonts")}
        ]),
        new UglifyJSPlugin(),
        new MiniCssExtractPlugin({
            // define where to save the file
            filename: folder("styles") + "/[name]/bundle.css",
            allChunks: true
        })
    ]
});
