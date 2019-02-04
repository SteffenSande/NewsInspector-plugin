const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let fontPath = "/styles/fonts/";
let publicFontPath = "chrome-extension://__MSG_@@extension_id__";

let scripts = "./scripts/";
let typescriptReactEntryFiles = '/index.tsx';
let javascriptEntryFiles = '/index.ts';
let styles = "./styles/";
let scssEntryFiles = '/index.scss';

/**
 * This is a function that returns the correct path to the entry file that needs to be converted to javascript or css.
 *
 * @param path string param that represents foldername
 * @param typescript boolean is it typescript?
 * @returns {string[] - a list that gives both the path to ts index file and scss index file  }
 */
function getEntryPoints(path, typescript) {
    return typescript ?
        [
            scripts + path + typescriptReactEntryFiles,
            styles + path + scssEntryFiles
        ] :
        [
            scripts + path + javascriptEntryFiles,
            styles + path + scssEntryFiles
        ];
}


module.exports = {
  entry: {
      background: getEntryPoints('background', false),
      content: getEntryPoints('content', false),
      popup: getEntryPoints("popup", false),
      devtools: getEntryPoints('devtools', false),
      panel: getEntryPoints('devtools-panel', true)
  },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
          use: [
              MiniCssExtractPlugin.loader,
              {
                  loader: "css-loader",
                  options: {
                      modules: true,
                      sourceMap: true,
                      modules: false
                  }
              },
              "sass-loader"
          ]
      }
    ]
  }
};
