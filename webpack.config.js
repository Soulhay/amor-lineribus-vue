const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 4202,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  output: {
    // Explicit publicPath: with 'auto' webpack emits import.meta.url,
    // which breaks when the shell loads remoteEntry.js as a classic script.
    publicPath: 'http://localhost:4202/',
    uniqueName: 'vueRemote',
    scriptType: 'text/javascript',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'vueRemote',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'vueRemote' },
      exposes: {
        './Mount': './src/mount.js',
      },
      shared: {
        vue: { singleton: true, requiredVersion: deps.vue },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};