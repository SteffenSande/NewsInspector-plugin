const path = require("path");
let merge = require("webpack-merge");
let common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log("Development running");

module.exports = merge(common, {
    output: {
        filename: "scripts/[name]/bundle.js",
        path: path.resolve(__dirname, "")
    },
    plugins: [
        new MiniCssExtractPlugin({
            // define where to save the file
            filename: "styles/[name]/bundle.css"
        })
    ]
});
