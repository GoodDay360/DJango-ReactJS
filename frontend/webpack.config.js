const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var fs = require('fs');
var glob = require('glob');
const Dotenv = require('dotenv-webpack');

function cleanDirectory(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}



var config = {
  entry: {
    "App": path.join(__dirname, "./src/App.jsx")
  },
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
    chunkFilename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {

    },
  },
  devServer: {
    hot: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
              drop_console: true
          },
          output: { comments: false, beautify: false }
        }
      })
    ]
  },
  
};

function setDefault(mode){
  // Default Config //
  config.module.rules = []
  config.plugins = [new Dotenv({path: path.join(__dirname, "../.env")}), new CleanWebpackPlugin()]
  // End //
  cleanDirectory(path.resolve(__dirname, "./static/frontend"))
  if (mode == "production"){
    config.module.rules = [
      {
        test: /\.m?(js|jsx|ts)$/,
        exclude: [
          path.resolve(__dirname, "./node_modules")
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'astroturf-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ]
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      
      })
    )
  }else{
    config.module.rules = [
      {
        test: /\.m?(js|jsx|ts)$/,
        exclude: [
          path.resolve(__dirname, "./node_modules")
        ],
        use: [
            {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ]
    config.plugins.push(new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("development"),

      })
    )
  }
}


module.exports = (env, argv) => {
  console.log(`This is the Webpack 'mode': ${argv.mode}`);
  setDefault(argv.mode)

  config["experiments"] = {
    topLevelAwait: true
  }
  return config
}