var glob = require("glob");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var getFileOfType = function(parent, dir, type) {
  return glob.sync("./" + parent + "/" + dir + "/**/*." + type);
};

var getFilesInDir = function(dir) {
  return getFileOfType("scripts", dir, "ts");
};

var getStyles = function(dir) {
  return getFileOfType("style", dir, "scss");
};

var fontPath = "/style/fonts/";
var publicFontPath = "chrome-extension://__MSG_@@extension_id__";

// This  is available for every module
// Composes a list of all the files in these folders
var commonJs = getFilesInDir("config").concat(
  getFilesInDir("models").concat(getFilesInDir("util"))
);

module.exports = {
  entry: {
    background: commonJs.concat(
      getFilesInDir("background").concat(getStyles("background"))
    ),
    content: commonJs.concat(
      getFilesInDir("content").concat(getStyles("content"))
    ),
    popup: commonJs.concat(getFilesInDir("popup").concat(getStyles("popup"))),
    devtools: commonJs.concat(
      getFilesInDir("devtools").concat(getStyles("devtools"))
    )
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true
              }
            },
            "sass-loader"
          ]
        })
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:
          "url-loader?limit=10000&mimetype=application/font-woff&name=[hash].[ext]&outputPath=" +
          fontPath +
          "&publicPath=" +
          publicFontPath
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          publicPath: publicFontPath,
          outputPath: fontPath
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  }
};
