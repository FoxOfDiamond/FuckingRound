const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
  mode:"development",
  output: {
    path: path.resolve(__dirname, 'compiled'),
    clean:true
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: 'src/index.html',
      }
    }),
  ],
  module: {
    rules: [
      { 
        test: /\.tsx?$/, loader: 'ts-loader' 
      },
      { 
        test: /\.css?$/, loader: 'css-loader' 
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.(ico|png|jpe?g|svg)/,
        type: 'asset/resource',
      }
    ]
  }
};
