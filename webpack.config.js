const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: '!!html-webpack-plugin/lib/loader.js!./index.html',
  filename: 'index.html',
  inject: 'body',
  hash: true,
  // favicon: `${__dirname}/favicon.ico`,
  title: 'Trend Micro - FED Intern Test',
});

module.exports = {
  entry: {
    main: './js/app.js',
  },
  output: {
    // 將輸出的檔案放到這個資料夾下
    path: path.join(__dirname, 'dist'),
    // 將所有依賴的模組都合併輸出到這個檔案
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node-modules/,
      },
      {
        test: /\.(css|scss|sass)$/,
        exclude: /node-modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|JPE?G|png|PNG|gif|GIF|svg|SVG|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=1024&name=[sha512:hash:base64:7].[ext]',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
    ],
  },
  devtool: 'eval',
  // webpack-dev-server 設定
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    inline: true,
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), HTMLWebpackPluginConfig],
};
